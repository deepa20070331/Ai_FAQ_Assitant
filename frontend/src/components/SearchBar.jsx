import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-field">
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search questions or topics"
        aria-label="Search saved FAQs"
      />
      {value && (
        <button className="icon-button" type="button" onClick={() => onChange('')} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
      {!value && <kbd>/</kbd>}
    </label>
  );
}
