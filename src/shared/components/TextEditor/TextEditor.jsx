import { useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import styles from "./TextEditor.module.css";

export default function TextEditor({
  className = "",
  register = () => {},
  name = "text",
  ...props
}) {
  const fullClassName = `${styles.textEditor} ${className}`.trim();

  const cursorPosition = useRef(0);
  const [value, setValue] = useState("");

  const registerProps = useMemo(() => register(name), [name, register]);

  const handleOnChange = (event) => {
    if (event.target.localName === "textarea") {
      cursorPosition.current = event.target.selectionStart;
      setValue(event.target.value);
      registerProps?.onChange?.(event);
    }
  };

  const handleOnClick = (event) => {
    if (event.target.localName === "textarea") {
      cursorPosition.current = event.target.selectionStart;
    }
  };

  const handleEmojiClick = ({ emoji }) => {
    setValue((prev) => {
      const valueArr = prev.split("");
      valueArr.splice(cursorPosition.current, 0, emoji);
      return valueArr.join("");
    });

    cursorPosition.current += emoji.length;
  };

  useEffect(() => {
    registerProps?.onChange?.({
      target: {
        name: registerProps?.name,
        value,
      },
      type: "change",
    });
  }, [value, registerProps]);

  return (
    <div className={fullClassName}>
      <textarea
        className={styles.textarea}
        {...props}
        name={registerProps?.name}
        ref={registerProps?.ref}
        onBlur={registerProps?.onBlur}
        spellCheck
        maxLength={2200}
        onChange={handleOnChange}
        onClick={handleOnClick}
        value={value}
      ></textarea>
      <p className={styles.length}>{value.length}/2200</p>
      <EmojiPicker
        reactionsDefaultOpen
        onReactionClick={handleEmojiClick}
        allowExpandReactions={false}
        lazyLoadEmojis
      />
    </div>
  );
}
