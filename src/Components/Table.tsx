import React, { JSX, useEffect } from 'react';
import { List, useListRef, RowComponentProps } from 'react-window';

type TableProps = {
  selectedItem: number;
  onSelect: (value: number) => void;
  string: string;
  color: string;
};
function Table({ selectedItem, onSelect, string, color }: TableProps): JSX.Element {
  const listRef = useListRef(null);
  const [optimisticValue, setOptimisticValue] = React.useState<number | null>(null);

  useEffect(() => {
    setOptimisticValue(null); // Reset on open
    if (selectedItem >= 0) {
      const raf = requestAnimationFrame(() => {
        listRef.current?.scrollToRow({
          index: selectedItem * 4,
          align: 'center',
          behavior: 'instant',
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [selectedItem]);

  const Row = ({ index, style }: RowComponentProps) => {
    const value = index * 0.25;
    const isSelected =
      optimisticValue !== null ? optimisticValue === value : selectedItem === value;
    return (
      <div
        style={style}
        onClick={() => {
          setOptimisticValue(value);
          onSelect(value);
          listRef.current?.scrollToRow({ index, align: 'center', behavior: 'smooth' });
        }}
        className={`border border-gray-500 rounded-xl text-xs text-center cursor-pointer flex items-center justify-center ${
          isSelected ? color : 'bg-black/15 hover:bg-white/10'
        }`}
      >
        {string ? (string == 'Weight: ' ? `${value} kg` : `${value} reps`) : value}
      </div>
    );
  };

  return (
    <List
      listRef={listRef}
      rowCount={600}
      rowHeight={50}
      rowComponent={Row}
      rowProps={{ step: 1 }}
      defaultHeight={80}
      className="h-20 lg:h-40 w-30 rounded-xl bg-gray-700/15 shadow-md"
      style={{ scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
    />
  );
}

export default Table;
