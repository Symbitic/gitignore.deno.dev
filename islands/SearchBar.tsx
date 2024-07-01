import { JSX } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { GitignoreFile } from "$/common/gitignore.ts";

export interface SearchBarProps {
  items: GitignoreFile[];
}

function IconX({ onClick }: { onClick?: () => void }) {
  return (
    <svg
      class="cursor-pointer"
      width="24"
      height="24"
      aria-hidden="true"
      stroke="currentColor"
      fill="none"
      onClick={onClick}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default function SearchBar({ items }: SearchBarProps) {
  const [extras, setExtras] = useState<string[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<GitignoreFile[]>([]);
  const extraRef = useRef<HTMLInputElement>(null);
  const filteredItemsRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("Items:");
    console.dir(items);
  }, [items]);

  const populateFromUrl = () => {
    if (!globalThis.location) {
      return;
    }
    const { searchParams } = new URL(location.href);
    if (searchParams.has("templates")) {
      const templates = searchParams.get("templates")!.split(",");
      const selectedItems = items.filter((item) =>
        templates.includes(item.name)
      );
      console.log(`Populating from templates: ${selectedItems.join(", ")}`);
      setSelectedItems(selectedItems);
    }

    if (searchParams.get("extras")) {
      const extras = searchParams.get("extras")!.split(",");
      console.log(`Populating from extras: ${extras}`);
      setExtras(extras);
    }
  };

  const addItem = (item: GitignoreFile) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems(selectedItems.concat(item));
      setSearchString("");
      setSelectedIndex(0);
    }
  };

  const removeItem = (item: GitignoreFile) => {
    const items = selectedItems.filter(({ path }) => item.path !== path);
    setSelectedItems(items);
  };

  const filteredItems = useMemo(
    () =>
      searchString.length === 0 ? [] : items
        .filter((item) =>
          item.name.toLowerCase().includes(searchString.toLowerCase())
        )
        .filter((item) =>
          !selectedItems.find((value) => value.path === item.path)
        ),
    [items, searchString],
  );

  useEffect(() => {
    console.log("Filtered items:");
    console.dir(filteredItems);
  }, [filteredItems]);

  const onSearch = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setSearchString(e.currentTarget.value);
  };

  const handleItemFocus = (index: number) => {
    setSelectedIndex(index);
  };

  const setItemFocus = (index: number) => {
    const suggestions = [
      ...(filteredItemsRef?.current?.querySelectorAll("li") ?? []),
    ];
    const el = suggestions
      .filter((el) => Number(el.dataset.index) === index)
      .at(0);
    el?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && selectedIndex < filteredItems.length - 1) {
      e.preventDefault();
      setItemFocus(selectedIndex + 1);
    } else if (e.key === "ArrowUp" && selectedIndex > 0) {
      e.preventDefault();
      setItemFocus(selectedIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const el = e.target as HTMLLIElement;
      const item = filteredItems[Number(el?.dataset.index)];
      addItem(item);
    }
  };

  const onKeyDownInput = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const suggestions = [
        ...(filteredItemsRef?.current?.querySelectorAll("li") ?? []),
      ];
      suggestions[0].focus();
    }
  };

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    let url = `/api/${selectedItems.map(({ name }) => name).join(",")}`;
    if (extras.length) {
      url += `?extras=${extras.join(",")}`;
    }

    location.href = new URL(url, location.origin).href;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target! as Node)) {
        setSearchString("");
        setSelectedIndex(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    populateFromUrl();
  }, []);

  return (
    <div class="relative flex-grow w-full">
      <form
        class="flex items-start w-full"
        onSubmit={onSubmit}
        ref={formRef}
      >
        <div class="w-full flex-grow">
          <div class="flex flex-col w-full">
            <input
              type="text"
              class="w-full h-full p-2 border border-gray-400 py-2 pl-2 pr-10 rounded-none focus:outline-none leading-tight"
              placeholder="Enter text here"
              autoFocus
              value={searchString}
              onInput={onSearch}
              onKeyDown={onKeyDownInput}
              ref={searchRef}
            />
            <div class="relative">
              <div class="flex flex-wrap gap-2 py-4">
                {selectedItems.map((item) => (
                  <span class="flex items-center text-blue-500 bg-blue-100 rounded-full px-3 py-1 text-sm">
                    {item.name}
                    <IconX onClick={() => removeItem(item)} />
                  </span>
                ))}
              </div>
            </div>
            <div class="relative">
              <ul
                class="border-none shadow-none rounded-none bg-white mt-0 p-0 absolute top-0 left-0 right-0 md:max-h-48 overflow-y-auto"
                role="listbox"
                aria-multiselectable={true}
                aria-expanded={filteredItems.length > 0}
                aria-hidden={filteredItems.length === 0}
                onKeyDown={handleKeyDown}
                ref={filteredItemsRef}
              >
                {filteredItems.map((item, i) => (
                  <li
                    onMouseEnter={() => handleItemFocus(i)}
                    onFocus={() => handleItemFocus(i)}
                    onClick={() => addItem(item)}
                    class={`p-3 cursor-pointer ${
                      selectedIndex === i ? "bg-blue-100" : ""
                    }`}
                    role="option"
                    aria-selected={selectedIndex === i}
                    tabIndex={0}
                    data-index={i}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <button
          type="submit"
          class="rounded-none text-white border-black bg-green-400 hover:bg-green-500 focus:outline-none py-2 px-4"
          disabled={selectedItems.length === 0}
        >
          Generate
        </button>
      </form>

      {extras.map((extra, i) => (
        <div class="w-full flex pb-2">
          <input
            type="text"
            class="w-full h-full p-2 border border-gray-400 text-gray-400 py-2 pl-2 pr-10 rounded-none focus:outline-none leading-tight"
            value={extra}
            disabled={true}
          />
          <button
            class="rounded-none text-white border-black bg-red-400 hover:bg-red-500 focus:outline-none py-2 px-4"
            onClick={() => {
              setExtras(extras.filter((_, j) => j !== i));
            }}
          >
            <IconX />
          </button>
        </div>
      ))}

      <div class="w-full flex">
        <input
          type="text"
          class="w-full h-full p-2 border border-gray-400 py-2 pl-2 pr-10 rounded-none focus:outline-none leading-tight"
          placeholder="Enter an extra line to ignore"
          ref={extraRef}
        />
        <button
          class="rounded-none text-white border-black bg-green-400 hover:bg-green-500 focus:outline-none py-2 px-4"
          onClick={() => {
            if (extraRef.current!.value.length && !extras.includes(extraRef.current!.value)) {
              setExtras(extras.concat(extraRef.current!.value));
              extraRef.current!.value = "";
            }
          }}
        >
          <svg
            class="cursor-pointer"
            width="24"
            height="24"
            aria-hidden="true"
            stroke="currentColor"
            fill="none"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
