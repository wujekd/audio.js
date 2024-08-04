document.addEventListener("DOMContentLoaded", function(){
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioPlayer = document.getElementById("audio");
    const source = audioCtx.createMediaElementSource(audioPlayer);

    const filter = audioCtx.createBiquadFilter();
    filter.frequency.value = 400;
    filter.type = "lowpass";
    filter.Q.value = 0.001;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    source.connect(filter);
    filter.connect(analyser);
    // source.connect(audioCtx.destination);
    analyser.connect(audioCtx.destination);

    const canvas = document.getElementById("oscilloscope");
    const canvasCtx = canvas.getContext("2d");

    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "rgb(28, 60, 39)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(160, 194, 180)";

        canvasCtx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }

    draw();

    function F1set(){
        const minFreq = 20;
        const maxFreq = 20000;
        const sliderValue = freqSlider.value;
        // Convert slider value to a logarithmic scale
        const logMinFreq = Math.log10(minFreq);
        const logMaxFreq = Math.log10(maxFreq);
        const logValue = logMinFreq + (sliderValue - minFreq) * (logMaxFreq - logMinFreq) / (maxFreq - minFreq);
        
        // Convert the logarithmic value back to a linear scale
        const scaledValue = Math.pow(10, logValue);
        
        filter.frequency.value = scaledValue;

    }
    const freqSlider = document.getElementById("freq-slider");
    freqSlider.addEventListener("input", function(){
        
        F1set();
        
    });

    F1set();


});