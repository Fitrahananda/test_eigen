// 1. Terdapat string "NEGIE1", silahkan reverse alphabet nya dengan angka tetap diakhir kata Hasil = "EIGEN1"

let text = "NEGIE1";
let string = [];
let number = "";
for (let i = 0; i < text.length; i++) {
  if (isNaN(text[i])) {
    string.push(text[i]);
  } else {
    number += text[i];
  }
}
string.reverse();

string = string.join("");
const newText = string + number;
console.log(newText, "number1");

// 2. Diberikan contoh sebuah kalimat, silahkan cari kata terpanjang dari kalimat tersebut, jika ada kata dengan panjang yang sama silahkan ambil salah satu

const sentence = "Saya sangat senang mengerjakan soal algoritma";
let longest = 0;
let count = 0;
for (let index = 0; index < sentence.length; index++) {
  if (sentence[index] !== " " || !sentence[index]) {
    count += 1;
  } else {
    if (longest < count) {
      longest = count;
    }
    count = 0;
  }
}
console.log(longest, "Number2");

//3. Terdapat dua buah array yaitu array INPUT dan array QUERY, silahkan tentukan berapa kali kata dalam QUERY terdapat pada array INPUT

INPUT = ["xc", "dz", "bbb", "dz"];
QUERY = ["bbb", "ac", "dz"];
let result = [];
for (let index = 0; index < QUERY.length; index++) {
  let filter = INPUT.filter((e) => e == QUERY[index]);
  result.push(filter.length);
}
console.log(result, "Number3");

// 4. Silahkan cari hasil dari pengurangan dari jumlah diagonal sebuah matrik NxN Contoh:

Matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];
let d1 = 0;
let d2 = 0;
for (let index = 0; index < Matrix.length; index++) {
  d1 += Matrix[index][index];
  d2 += Matrix[index][Matrix.length - index - 1];
}
console.log(d1 - d2, "Number4");
