
// ZL-TASK:

// Shunday function yozing, u parametrda berilgan stringni kebab casega otkazib qaytarsin. Bosh harflarni kichik harflarga ham otkazsin.
// MASALAN: stringToKebab(“I love Kebab”) return “i-love-kebab”
function stringToKebab(str) {
  return str
    .toLowerCase()          // hammasini kichik harfga o‘tkazamiz
    .trim()                // bosh va oxiridagi bo‘shliqlarni olib tashlaymiz
    .replace(/\s+/g, "-"); // bo‘shliqlarni "-" ga almashtiramiz
}
// Misol
console.log(stringToKebab("I love Kebab")); // "i-love-kebab"


// TASK ZM:

// Shunday function yozing, va bu function parametr
// sifatida raqamlarni qabul qilsin. Bu function qabul qilingan
// raqamlarni orqasiga o'girib qaytarsin

// MASALAN: reverseInteger(123456789); return 987654321;

// Yuqoridagi misolda, function kiritilgan raqamlarni orqasiga
// o'girib (reverse) qilib qaytarmoqda.

function reverseInteger(num) {
  return Number(
    num.toString().split('').reverse().join('')
  );
}

console.log(reverseInteger(123456789)); 


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


