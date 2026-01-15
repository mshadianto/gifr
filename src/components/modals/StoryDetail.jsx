import React from 'react';
import { formatCurrency } from '../../utils/impactCalculator';

const StoryDetail = ({ isOpen, onClose, story, darkMode }) => {
  if (!isOpen || !story) return null;

  // Parse markdown-like content
  const renderContent = (text) => {
    return text.split('\n\n').map((paragraph, idx) => {
      // Check for bold text
      if (paragraph.startsWith('**') && paragraph.includes(':**')) {
        const title = paragraph.match(/\*\*(.*?)\*\*/)?.[1];
        const content = paragraph.replace(/\*\*.*?\*\*/, '').replace(':', '');
        return (
          <div key={idx} className="mb-4">
            <h4 className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h4>
            <p className={darkMode ? 'text-stone-300' : 'text-stone-600'}>{content}</p>
          </div>
        );
      }

      // Check for list items
      if (paragraph.includes('\n- ')) {
        const lines = paragraph.split('\n');
        const title = lines[0].replace(/\*\*/g, '');
        const items = lines.slice(1).filter(l => l.startsWith('- '));
        return (
          <div key={idx} className="mb-4">
            {title && <h4 className={`font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h4>}
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={i} className={`flex items-start gap-2 ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                  <span className="text-emerald-500">•</span>
                  {item.replace('- ', '')}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Check for italic quote
      if (paragraph.startsWith('*"') || paragraph.startsWith('*"')) {
        return (
          <blockquote key={idx} className={`italic border-l-4 border-emerald-500 pl-4 my-4 ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
            {paragraph.replace(/\*/g, '')}
          </blockquote>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className={`mb-4 leading-relaxed ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${darkMode ? 'bg-stone-800' : 'bg-white'}`}>
        {/* Header Image */}
        <div className={`h-48 flex items-center justify-center bg-gradient-to-br ${darkMode ? story.gradientDark : story.gradientLight}`}>
          <span className="text-9xl">{story.emoji}</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 text-sm rounded-full ${darkMode ? story.tagColorDark : story.tagColorLight}`}>
              {story.category}
            </span>
            <span className={`text-sm ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
              📍 {story.location}
            </span>
          </div>

          {/* Title */}
          <h2 className={`text-3xl font-light mb-2 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {story.title}
          </h2>

          {/* Beneficiary Info */}
          <p className={`text-sm mb-6 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            {story.name}, Age {story.age}
          </p>

          {/* Stats Cards */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl mb-6 ${darkMode ? 'bg-stone-700' : 'bg-stone-50'}`}>
            {story.stats && Object.entries(story.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>
                  {typeof value === 'number' && key.includes('Contribution')
                    ? formatCurrency(value)
                    : value}
                </p>
              </div>
            ))}
          </div>

          {/* Full Story */}
          <div className="prose prose-stone max-w-none">
            {renderContent(story.fullStory)}
          </div>

          {/* Impact Badge */}
          <div className={`mt-6 p-4 rounded-xl text-center ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              ✨ Your Waqf contributed <strong>{formatCurrency(story.stats?.yourContribution || 0)}</strong> to {story.name.split(' ')[0]}'s journey
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                darkMode
                  ? 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Close
            </button>
            <button className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all">
              Share Story 💚
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
