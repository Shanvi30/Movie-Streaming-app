import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  { question: "What is Netflix?", answer: "Netflix is a streaming service..." },
  { question: "How much does Netflix cost?", answer: "Plans range from..." },
  { question: "Where can I watch?", answer: "You can watch anywhere..." },
  { question: "How do I cancel?", answer: "You can cancel anytime..." },
  { question: "What can I watch on Netflix?", answer: "You can watch..." },
  { question: "Is Netflix good for kids?", answer: "Netflix offers a kids profile..." }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className="faq-icon">{activeIndex === index ? "×" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
