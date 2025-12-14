import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";

import Avatar from "../Avatar/Avatar";
import smileIcon from "../../../assets/icons/smile.svg";
import { selectUser } from "../../../redux/auth/authSelectors";

import styles from "./TextEditor.module.css";

const { VITE_API_URL: baseURL } = import.meta.env;

const buildAvatarUrl = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http") || avatar.startsWith("/")) return avatar;
  if (baseURL) return `${baseURL}/${avatar}`;
  return avatar;
};

export default function TextEditor({
  className = "",
  register = () => {},
  name = "text",
  ...props
}) {
  const fullClassName = `${styles.textEditor} ${className}`.trim();

  const user = useSelector(selectUser);
  const username = user?.username || "username";
  const avatarUrl = useMemo(() => buildAvatarUrl(user?.avatar), [user?.avatar]);

  const cursorPosition = useRef(0);
  const [value, setValue] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

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

  const handleEmojiToggle = () => {
    setIsEmojiOpen((prev) => !prev);
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
      <div className={styles.userInfo}>
        <Avatar size="xs" src={avatarUrl} alt="User avatar" />
        <span className={styles.username}>{username}</span>
      </div>
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
      <div className={styles.emojiRow}>
        <button
          type="button"
          className={styles.emojiButton}
          onClick={handleEmojiToggle}
          aria-label="Add emoji"
        >
          <img src={smileIcon} alt="" width={20} height={20} />
        </button>
        <div
          className={`${styles.emojiPickerWrapper} ${
            isEmojiOpen ? styles.open : ""
          }`}
        >
          <EmojiPicker
            className={styles.emojiPicker}
            reactionsDefaultOpen
            onReactionClick={handleEmojiClick}
            allowExpandReactions={false}
            lazyLoadEmojis
          />
        </div>
      </div>
    </div>
  );
}
