import { useRef, useEffect, useState } from "react";
import api from "../../service/api";

export const WindowContent = ({content, setContent, page}) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const currentHeight = textarea.offsetHeight;
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight;

      if (newHeight > currentHeight) {
        textarea.style.height = newHeight + "px";
      } else {
        textarea.style.height = currentHeight + "px";
      }
    }
  };

  const updatePage = async () => {
    try {
      console.log(page);
      
      await api.put(`/atualizarPagina/${page.id}`, {titulo: page.title, tipo: page.type, conteudo: page.textContent}
      )
    } catch  (error) {
      console.error("Error fetching pages", error);
    }
  }

  useEffect(() => {
    adjustHeight();    

    setTimeout(() => {
      updatePage()
    }, 5000)
  }, [content]);

  return (
    <textarea
      ref={textareaRef}
      className="inner-window resize-none overflow-hidden"
      onInput={adjustHeight}
      rows={1}      
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
};
