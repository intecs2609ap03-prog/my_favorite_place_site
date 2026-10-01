const delayMilliSec = 300;

const cards = document.querySelectorAll('.card');

// 画面に表示された際に実行される関数を登録できるオブザーバーパターンの実装
const intersectionobserver = new IntersectionObserver((entries) => {
    let i = 1;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            const delay = i * delayMilliSec;// delayMilliSecずつずらす。

            // 遅延実行の内容が記されたファンクタ
            const deleyExeFunc = () => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                intersectionobserver.unobserve(card);// 遅延実行後登録解除
            };

            setTimeout(deleyExeFunc, delay);// 遅延実行
            i++;
        }
    });
});

cards.forEach(card => {
    intersectionobserver.observe(card);
});