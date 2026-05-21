class PCMProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input && input[0]) {
            const inputData = input[0];
            // Convert Float32 to Int16 PCM
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
            }
            this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
        }
        return true;
    }
}
registerProcessor('pcm-processor', PCMProcessor);
