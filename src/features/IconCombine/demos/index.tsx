import { IconCombine, OpenAI } from "ai-logo";

export default () => {
  return (
    <IconCombine
      Icon={OpenAI}
      Text={OpenAI.Text}
      extra={"ChatGPT"}
      extraStyle={{ marginLeft: 8 }}
      size={64}
      spaceMultiple={0.1}
      textMultiple={0.75}
    />
  );
};
