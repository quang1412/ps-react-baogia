import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
// import 'bootstrap/dist/css/bootstrap.min.css';

export const IFrame = ({ children, headerContent, ...props }) => {
  const [contentRef, setContentRef] = useState(null)
  const mountNode = contentRef?.contentWindow?.document?.body
  const headNode = contentRef?.contentWindow?.document?.head;

  useEffect(() => {
    if (headNode && headerContent) {
      // Append header content to the iframe's head
      // This could be a <style> tag, <meta> tags, or other head elements
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = headerContent; // Assuming headerContent is HTML string
      while (tempDiv.firstChild) {
        headNode.appendChild(tempDiv.firstChild);
      }
    }
  }, [headNode, headerContent]);

  return (
    <iframe {...props} ref={setContentRef} style={{ width: "100vw", height: "100vh" }} >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  )
}
