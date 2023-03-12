import { JSX } from "preact";
import { useMemo, useState } from "preact/hooks";
import type { GitHubFile } from "$/common/github.ts";

export interface SearchBarProps {
  items: GitHubFile[];
}

export default function SearchBar({ items }: SearchBarProps) {
  const [searchString, setSearchString] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const filteredItems = useMemo(
    () =>
      searchString.length === 0
        ? []
        : items.filter((item) =>
          item.name.toLowerCase().includes(searchString.toLowerCase())
        ),
    [items, searchString],
  );

  const onSearch = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setSearchString(e.currentTarget.value);
  };

  const handleItemFocus = (index: number) => {
    setSelectedIndex(index);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && selectedIndex < filteredItems.length - 1) {
      e.preventDefault();
      setSelectedIndex(selectedIndex + 1);
    } else if (e.key === "ArrowUp" && selectedIndex > 0) {
      e.preventDefault();
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div class="relative flex-grow w-full">
      <div class="flex items-start w-full">
        <div class="w-full flex-grow">
          <div class="flex flex-col w-full">
            <input
              type="text"
              class="w-full h-full p-2 border border-gray-400 py-2 pl-2 pr-10 rounded-none focus:outline-none leading-tight"
              placeholder="Enter text here"
              value={searchString}
              onInput={onSearch}
            />
            <div class="relative">
              <ul
                class="border-none shadow-none rounded-none bg-white mt-0 p-0 absolute top-0 left-0 right-0 md:max-h-48 overflow-y-auto"
                role="listbox"
                aria-multiselectable={true}
                aria-expanded={filteredItems.length > 0}
                aria-hidden={filteredItems.length === 0}
                onKeyDown={handleKeyDown}
              >
                {filteredItems.map((item, i) => (
                  <li
                    onMouseEnter={() => handleItemFocus(i)}
                    onFocus={() => handleItemFocus(i)}
                    onClick={() => {}}
                    onKeyDown={handleKeyDown}
                    class={`p-3 cursor-pointer ${selectedIndex === i ? "bg-blue-100" : ""}`}
                    role="option"
                    aria-selected={selectedIndex === i}
                    tabIndex={0}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <button class="rounded-none text-white border-black bg-green-400 hover:bg-green-500 focus:outline-none py-2 px-4">
          Generate
        </button>
      </div>
    </div>
  );
}
