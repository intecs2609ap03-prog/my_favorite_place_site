/*
  波のようなシェーダーエフェクトのシェーダーをコンパイルして
  リンクしたプログラムオブジェクトのIDを返す関数
*/
function GetMyEffectProgram() {
  const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    out vec2 vUv;
    void main() {
      vUv = a_position; // -1.0 〜 1.0 の範囲
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `#version 300 es
    precision mediump float;
    
    uniform float u_time;
    uniform vec2 u_mousepos; // (0.0 〜 1.0 で受け取る)
    in vec2 vUv;
    out vec4 outColor;

    void main() {
      // 1. ベースの濃い紺色 (#0F172A 系)
      vec3 bgColor = vec3(0.058, 0.09, 0.165);

      // 2. マウス座標(0.0〜1.0)を、シェーダーの座標系(-1.0〜1.0)に変換する
      // ※JavaScript側でYを反転させていない場合はここで (1.0 - u_mousepos.y) に調整できます
      vec2 mouseCoord = vec2(u_mousepos.x * 2.0 - 1.0, (1.0 - u_mousepos.y) * 2.0 - 1.0);

      // 3. ピクセルとマウス位置の距離を測って「光のスポット」を作る
      float distToMouse = distance(vUv, mouseCoord);
      float mouseGlow = 0.08 / (distToMouse + 0.15); // マウスの近くほど強く光る

      // 4. マウスの位置によって波のうねり方も変化させる
      float t = u_time * 0.3;
      float wave = sin(vUv.x * 3.0 + t + mouseCoord.x * 2.0) * cos(vUv.y * 3.0 - t + mouseCoord.y * 2.0);
      float waveIntensity = smoothstep(-1.0, 1.0, wave) * 0.3;

      // 5. カラーの合成（紺色ベース ＋ マウスの光 ＋ 波の模様）
      vec3 lightColor = vec3(0.15, 0.5, 0.9) * mouseGlow; // シアン〜ブルーの光
      vec3 waveColor = vec3(0.2, 0.4, 0.7) * waveIntensity;

      vec3 finalColor = bgColor + lightColor + waveColor;

      // 画面の端を少し引き締める（ビネット効果）
      finalColor *= (1.0 - dot(vUv, vUv) * 0.2);

      outColor = vec4(finalColor, 1.0);
    }
  `;
  
    const vertexShaderId = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);// 頂点シェーダーコンパイル
    const fragmentShaderId = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);// フラグメントシェーダーコンパイル
    const programId = createProgram(gl, vertexShaderId, fragmentShaderId);// リンクしてGPUで動かせるプログラムオブジェクトの作成
    return programId;
}