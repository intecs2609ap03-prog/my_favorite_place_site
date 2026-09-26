const canvas = document.getElementById('bg-canvas');

const gl = canvas.getContext('webgl2');

if (!gl) {
  alert('WebGL 2がサポートされていません');
}

const programId = GetMyEffectProgram();// 別エフェクトに切り替えたいならこの関数を変更する

const vaoID = gl.createVertexArray();// vaoを作成してそのIDを返す
gl.bindVertexArray(vaoID);// 先ほど作成したvaoを操作対象にする

const positionBufferId = gl.createBuffer();// VBO作成してVBOのIDを返す
gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferId); // VBOを操作対象にする

// ローカル空間最大の四角面
const positions = new Float32Array([
  -1.0, -1.0,
   1.0, -1.0,
  -1.0,  1.0,
   1.0,  1.0,
]);

gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);// VBOに頂点情報を流し込む

const a_positionVarID = gl.getAttribLocation(programId, "a_position");// シェーダーでa_positionというattrib変数を使えるようにして設定用IDを取得

gl.vertexAttribPointer(a_positionVarID, 2, gl.FLOAT, false, 0, 0);// VAOにVBO上のデータの構造を記録
gl.enableVertexAttribArray(a_positionVarID);// シェーダーの変数にvboのデータを流し込むことを有効化

gl.bindVertexArray(null);// VAOのバインド解除
gl.bindBuffer(gl.ARRAY_BUFFER, null);// VBOのバインド解除

gl.useProgram(programId);// リンク済みのプログラムを実行可能な状態にする

const u_timeVarID = gl.getUniformLocation(programId, "u_time");// シェーダーでu_timeというuniform変数を使えるようにして設定用IDを取得
const u_resolutionVarID = gl.getUniformLocation(programId, "u_resolution");// シェーダーでu_resolutionというuniform変数を使えるようにして設定用IDを取得
const u_mouseposID = gl.getUniformLocation(programId, "u_mousepos");// シェーダーでu_mouseposというuniform変数を使えるようにして設定用IDを取得

gl.uniform2f(u_mouseposID, 0.5, 0.5);

// リサイズイベント
window.addEventListener('resize', (e) => {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth * pixelRatio;
  const height = window.innerHeight * pixelRatio;

  canvas.width = width;
  canvas.height = height;

  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  // 描画サイズの変更とuniform変数の送信
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(u_resolutionVarID, canvas.width, canvas.height);
});

// マウスムーブイベント
window.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 0.0 〜 1.0 に正規化
  const mouseX = x / rect.width;
  const mouseY = y / rect.height;

  gl.uniform2f(u_mouseposID, mouseX, mouseY);
});

// ループ処理
function loop(time) {
  /*
    [メモ]
    普通の3dソフトでは1オブジェクトにつき1つのvboと1つのvaoをもっており
    glDrawArraysで描画する前にそのvaoをバインドすればそのオブジェクトを描画可能

    しかし実際の3Dモデルは「座標」だけでなく、
    「色」「テクスチャのUV座標」「光を計算するための法線（向き）」など、たくさんの情報を持ちます。
    そのため、「座標用VBO」「UV用VBO」「法線用VBO」と3〜4個のVBOを作り、
    それらすべてを1つのVAOに記憶させるのが一般的です。
  */

  const timeInSeconds = time * 0.001;// 経過時間を秒単位に変換

  gl.uniform1f(u_timeVarID, timeInSeconds);// Uniform変数の更新

  gl.bindVertexArray(vaoID);// 描画したいオブジェクトのvaoをバインドして描画対象にする
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);// シェーダー実行と描画
  gl.bindVertexArray(null);// 描画対象のvaoを解除

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);