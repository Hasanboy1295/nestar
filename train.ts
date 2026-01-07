

// Anagrammalarni Guruhlash

// Sizga stringlar (so'zlar) massivi berilgan. Sizning vazifangiz anagrammalarni birga guruhlashdir.

// Eslatma: Anagramma — bu boshqa so'zning harflarini qayta tartiblash orqali hosil qilingan so'z (masalan, "cinema" va "iceman").


// INPUT:
// const strs = ["eat", "tea", "tan", "ate", "nat", "bat"]; 

// OUTPUT: 
// result = [
//   ["eat", "tea", "ate"],
//   ["tan", "nat"],
//   ["bat"]

function groupAnagrams(strs: string[]): string[][] {
  const map: Record<string, string[]> = {};

  for (const word of strs) {
    // So‘zni saralab kalit hosil qilamiz
    const key = word.split("").sort().join("");

    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(word);
  }

  return Object.values(map);
}

// Misol
const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log(groupAnagrams(strs));





// Shunday function yozing, u 2 ta array parametr qabul qilsin.
// Siz bu ikki arrayning qiymatlari o'xshash bo'lishini 
// (ya'ni, ularning barcha elementlari bir xil bo'lishini) tekshirishingiz kerak.

// MASALAN:
// areArraysEqual([1, 2, 3], [3, 1, 2]) // true
// areArraysEqual([1, 2, 3], [3, 1, 2, 1]) // true
// areArraysEqual([1, 2, 3], [4, 1, 2]) // false

function areArraysEqual(arr1, arr2) {
  return arr1.every(item => arr2.includes(item));
}
console.log(areArraysEqual([1, 2, 3], [3, 1, 2]));      
console.log(areArraysEqual([1, 2, 3], [3, 1, 2, 1]));  
console.log(areArraysEqual([1, 2, 3], [4, 1, 2]));    


// TASK ZN:

// Shunday function yozing, uni array va number parametri bo'lsin.
// Function'ning vazifasi ikkinchi parametr'da berilgan raqam, birinchi
// array parametr'ning indeksi bo'yicha hisoblanib, shu indeksgacha bo'lgan
// raqamlarni indeksdan tashqarida bo'lgan raqamlar bilan o'rnini
// almashtirib qaytarsin.

// MASALAN: rotateArray([1, 2, 3, 4, 5, 6], 3); return [5, 6, 1, 2, 3, 4];
// function rotateArray(arr, index) {
//   return [...arr.slice(index), ...arr.slice(0, index)];
// }

function rotateArray(arr, index) {
  const i = index % arr.length;
  return [...arr.slice(i), ...arr.slice(0, i)];
}
console.log(rotateArray([1, 2, 3, 4, 5, 6], 3));

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
///console.log(stringToKebab("I love Kebab")); // "i-love-kebab"


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

//console.log(reverseInteger(123456789)); 


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

//printNumbers();


