import { ValidationError } from "../errors/validation.error";

abstract class TimeConverter {
  static timeToMilliseconds(time: string): number {
    const timeFormat = /^\d{2}:\d{2}:\d{2}$/;
    const isTimeValid = timeFormat.test(time);

    if (!isTimeValid)
      throw new ValidationError(
        'string.pattern.base": "O campo deve estar no formato HH:MM:SS'
      );

    const [hours, minutes, seconds] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds))
      throw new ValidationError("a duração deve ser um tempo válido");

    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  static millisecondsToTime(ms: number): string {
     if (!Number.isInteger(ms) || ms < 0) {
    throw new Error("O valor deve ser um número inteiro positivo.");
  }

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
}

export default TimeConverter
