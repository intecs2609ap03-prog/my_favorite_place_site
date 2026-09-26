/*
  [シェーダーのコンパイル]
  gl - WebGlのコンテキスト
  type - シェーダーの種類 (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
  source - シェーダーのソースコードの文字列
*/
function createShader(gl, type, source) {
    const shaderId = gl.createShader(type);// 空のシェーダーオブジェクトのID

    gl.shaderSource(shaderId, source);// シェーダーオブジェクトにソースコードを流し込む
    gl.compileShader(shaderId);// 先ほど流し込んだシェーダーのコンパイル
    const isCompileFailed = !gl.getShaderParameter(shaderId, gl.COMPILE_STATUS);// 差しほどのコンパイルが成功したかどうかの判定

    if (isCompileFailed) {
        const errorLog = gl.getShaderInfoLog(shaderId);// コンパイルエラーの内容を取得

        console.error('Shader error:', errorLog);// ブラウザのコンソールにエラーログ表示
        gl.deleteShader(shaderId);// コンパイルに失敗したシェーダーオブジェクトの削除

        return null;
    }

    return shaderId;// コンパイルに成功したシェーダーオブジェクトのIDを返す
}

/*
  [コンパイル済みシェーダーをリンクしてGPU上で実行するプログラムオブジェクトを作成する]
  gl - WebGlのコンテキスト
  vertexShaderId - 頂点シェーダーのオブジェクトID
  fragmentShaderId - フラグメントシェーダーのオブジェクトID
*/
function createProgram(gl, vertexShaderId, fragmentShaderId) {
    const programId = gl.createProgram();// 空のプログラムオブジェクトのID

    gl.attachShader(programId, vertexShaderId);// プログラムオブジェクトに頂点シェーダーを紐付ける
    gl.attachShader(programId, fragmentShaderId);// プログラムオブジェクトにフラグメントシェーダーを紐付ける
    gl.linkProgram(programId);// プログラムオブジェクトのリンク

    const isLinkFailed = !gl.getProgramParameter(programId, gl.LINK_STATUS);// リンクが成功したかどうかの判定

    if (isLinkFailed) {
        const errorLog = gl.getProgramInfoLog(programId);// リンクエラーの内容を取得

        console.error('Program error:', errorLog);// ブラウザのコンソールにエラーログ表示
        gl.deleteProgram(programId);// リンクに失敗したプログラムオブジェクトの削除

        return null;
    }

    return programId;// リンクに成功したプログラムオブジェクトのIDを返す
}