// TASK ZK:
// Shunday function yozing, bu function har bir soniyada bir marotaba
// console'ga 1'dan 5'gacha bo'lgan raqamlarni chop etsin va
// 5 soniyadan so'ng function o'z ishini to'xtatsin
//   
// MASALAN: printNumbers();

function printNumbers() {
  let i = 1;

  const intervalId = setInterval(() => {
    console.log(i);
    i++;

    if (i > 5) {
      clearInterval(intervalId);
    }
  }, 1000);
}

printNumbers();
