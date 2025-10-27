import { usePage } from "@inertiajs/react";

const defaultSpamWords = [
    "พนัน", "หวย", "เดิมพัน", "บาคาร่า", "สล็อต", "ยิงปลา",
    "มวย", "แทง", "ยิง", "นายก", "รัฐบาล", "หนังโป๊",
    "xxx", "เย็ด", "รูปโป๊", "คลิปโป๊", "แทงบอลออนไลน์",
    "คาสิโนออนไลน์", "รวย", "ยาเสพติด"
];

export function useDetectSpamWord(msg: string, spam_world: string[]){
  const spamWords: string[] = spam_world as string[] ?? defaultSpamWords as string[];

    if (!msg) return [];

    const message = msg.toLowerCase();
    const matchedWords = spamWords.filter(word =>
      message.includes(word.toLowerCase())
    );

    return matchedWords; // คืน array ของคำที่เจอ
}
