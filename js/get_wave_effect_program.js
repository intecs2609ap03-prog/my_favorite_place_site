/*
  波のようなシェーダーエフェクトのシェーダーをコンパイルして
  リンクしたプログラムオブジェクトのIDを返す関数
*/
function GetWaveEffectProgram() {
    const vertexShaderSource = `#version 300 es
      in vec2 a_position;
      out vec2 vUv;
      void main() {
        // -1.0 ~ 1.0 の座標を 0.0 ~ 1.0 の UV座標に変換
        vUv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `#version 300 es
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      in vec2 vUv;

      out vec4 outColor; // gl_FragColorの代わりに出力変数を定義

      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.2; 
        float fadeX = smoothstep(0.8, 0.1, abs(uv.x));
        vec3 finalColor = vec3(0.01, 0.015, 0.03);

        for(int i = 0; i < 5; i++) {
          float fi = float(i);
          
          float freq = 1.5 + fi * 0.6;
          float speed = 0.4 + fi * 0.15;
          float amp = 0.03 + fi * 0.012;
          
          float y = sin(uv.x * freq + t * speed) * amp;
          y += cos(uv.x * (freq * 0.5) - t * (speed * 0.7)) * (amp * 0.8);
          
          float dist = uv.y - y;
          float absDist = abs(dist);
          
          float line = smoothstep(0.003, 0.0, absDist);
          float glow = smoothstep(0.04, 0.0, absDist) * 0.4;
          float veil = smoothstep(0.0, -0.15, dist) * smoothstep(-0.3, 0.0, dist) * 0.15;
          
          vec3 colorStart = vec3(0.05, 0.15, 0.40);
          vec3 colorEnd   = vec3(0.20, 0.60, 0.85);
          vec3 waveColor  = mix(colorStart, colorEnd, fi / 4.0);
          
          float intensity = (line + glow + veil) * fadeX;
          finalColor += waveColor * intensity;
        }

        outColor = vec4(finalColor, 1.0); // 定義した変数に出力
      }
    `;

    const vertexShaderId = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);// 頂点シェーダーコンパイル
    const fragmentShaderId = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);// フラグメントシェーダーコンパイル
    const programId = createProgram(gl, vertexShaderId, fragmentShaderId);// リンクしてGPUで動かせるプログラムオブジェクトの作成
    return programId;
}