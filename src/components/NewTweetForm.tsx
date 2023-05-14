import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import { useCallback, useLayoutEffect, useRef, useState } from "react";


function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

export function NextTweetForm() {
   const session = useSession();
   if (session.status !== "authenticated") return;

   return <Form/>;
}

function Form () {
    const session = useSession()
    const [inputValue, setInputValue] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement>() // a reference to a specific html element -- to the text are
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea
    },[])

    useLayoutEffect(() => { // useEffect defines a function that gets called once when component (NewTweetForm) first appears on page.
        updateTextAreaSize(textAreaRef.current)
    }, [inputValue]) // function inside useEffect is also called on top of when NewTweetForm renders

    if (session.status !== "authenticated") return null;

  return <form className="flex flex-col gap-2 border-b px-4">
    <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea 
        ref={inputRef}
        style={{ height:0 }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} //e is event that gets passed as argument to function. e.target.value has current 
        className="flex-grew resize-none overflow-hidden p-4 text-lg outline-none" 
        placeholder="what's happening sis"/>
    </div>
    <Button className="self-end">Tweet</Button>
  </form>;
}

