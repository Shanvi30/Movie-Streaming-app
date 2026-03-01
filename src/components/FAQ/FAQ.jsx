import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    q: "What is Movie Streaming App?",
    a: "A platform to browse and track movies and TV shows.",
  },
  {
    q: "How do I watch content?",
    a: "Click on any title to view details and trailer.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can manage your account anytime.",
  },
  {
    q: "Is it kid-friendly?",
    a: "Yes, content is available for all age groups.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((item, i) => (
        <div
          key={i}
          className="faq-item"
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="faq-question">
            {item.q} <span>{open === i ? "✕" : "+"}</span>
          </div>
          {open === i && <div className="faq-answer">{item.a}</div>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
