import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";

const nlp = winkNLP(model);

export const findTimes = (text: string) => {
  const doc = nlp.readDoc(text);

  const times = doc
    .entities()
    .filter((e) => e.out(nlp.its.type) === "TIME")
    .out()
    .filter(
      (t) =>
        t.toUpperCase() !== "NIGHT" &&
        t.toUpperCase() !== "EVENING" &&
        t.toUpperCase() !== "AFTERNOON",
    );

  return times;
};

export const findTime = (text: string) => {
  const times = findTimes(text);
  return times.length > 0 ? times[0] : null;
};

export const findDate = (text: string) => {
  const doc = nlp.readDoc(text);

  const times = doc
    .entities()
    .filter((e) => e.out(nlp.its.type) === "DATE")
    .out();

  return times.length > 0 ? times.join(" ") : null;
};
