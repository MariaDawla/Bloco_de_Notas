import { useState, useEffect, useRef } from "react";
import { Tab } from "../Tab";

export const DraggableWindow = ({ children, windowPages, selectedPage = 0, setSelectedPage }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [readyToResumeX, setReadyToResumeX] = useState(false);
    const [readyToResumeY, setReadyToResumeY] = useState(false);
    const [pages, setPages] = useState(windowPages)
    const boxRef = useRef();

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
          const handleMouseMove = (e) => {
            if (!isDragging) return;

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const containerPadding = 48;
            const containerWidth = window.innerWidth - containerPadding;
            const containerHeight = window.innerHeight - containerPadding;

            if (mouseX < 0 || mouseX > containerWidth) {
                setReadyToResumeX(false);
            } else if (!readyToResumeX) {
                if (mouseX >= 16 && mouseX <= containerWidth - 16) {
                    setReadyToResumeX(true);
                    setLastMousePos((pos) => ({ ...pos, x: mouseX }));
                }
            }

            if (mouseY < 0 || mouseY > containerHeight) {
                setReadyToResumeY(false);
            } else if (!readyToResumeY) {
                if (mouseY >= 16 && mouseY <= containerHeight - 16) {
                    setReadyToResumeY(true);
                    setLastMousePos((pos) => ({ ...pos, y: mouseY }));
                }
            }

            let newX = position.x;
            let newY = position.y;

            if (readyToResumeX) {
                const deltaX = mouseX - lastMousePos.x;
                newX += deltaX;
                newX = Math.max(0, Math.min(newX, containerWidth - boxRef.current.offsetWidth));
            }

            if (readyToResumeY) {
                const deltaY = mouseY - lastMousePos.y;
                newY += deltaY;
                newY = Math.max(0, Math.min(newY, containerHeight - boxRef.current.offsetHeight));
            }

            if (readyToResumeX || readyToResumeY) {
                setPosition({ x: newX, y: newY });
                setLastMousePos({ x: mouseX, y: mouseY });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, lastMousePos]);

    return (
        <div
            className="box"
            style={{
                "--x": `${position.x}`,
                "--y": `${position.y}`,
                cursor: isDragging ? "grabbing" : "grab",
            }}
        >
        <div className="pages"             
            ref={boxRef}
            onMouseDown={handleMouseDown}
        >
            <div className="gradient-overlay"></div>
            <div className={`gap ${selectedPage === 0 && "previous"}`}></div>
            {pages.map((page, idx) => (
                <Tab title={page.title} key={idx} className={selectedPage === idx ? "selected" : selectedPage - 1 === idx ? "previous" : selectedPage + 1 === idx ? "next" : ""} onClick={() => setSelectedPage(idx)} />
            ))}
            <div className={`gap end ${selectedPage === pages.length - 1 && "next"}`}></div>
        </div>
        {children}
        </div>
    );
};
