import process from 'node:process';

export function writeOnTheSameLine(index: number, text: string) {
  process.stdout.cursorTo(index);
  process.stdout.clearLine(1);
  process.stdout.write(text);
}

export function clearStaticMessaging() {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
}
