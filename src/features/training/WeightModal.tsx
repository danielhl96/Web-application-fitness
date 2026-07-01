import { RefObject } from 'react';
import TemplateModal from '../../shared/Components/templatemodal.tsx';
import Table from '../../shared/Components/Table.tsx';
import Button from '../../shared/Components/button.js';

interface WeightModalProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollRef2: RefObject<HTMLDivElement | null>;
  selectedWeight1: number[];

  idx: number;
  handleWeightSelect: (weight: number) => void;

  changeWeight: (index: number, flag: boolean) => void;
  onClose: () => void;
  'data-cy'?: string;
}

export default function WeightModal({
  scrollRef,
  selectedWeight1,
  idx,
  handleWeightSelect,
  changeWeight,
  onClose,
  'data-cy': dataCy,
}: WeightModalProps) {
  return (
    <TemplateModal>
      <div>
        <div className="flex flex-row justify-center items-center text-xs">
          {/* Whole kg picker (virtualized) */}
          <div ref={scrollRef} data-cy={dataCy}>
            <Table
              data-cy={`weight-table-${idx}`}
              selectedItem={selectedWeight1[idx] ?? 0}
              onSelect={handleWeightSelect}
              string="Weight: "
              color="bg-blue-500"
            />
          </div>
        </div>

        <div className="modal-action justify-center">
          <Button
            data-cy="weight-button"
            border="#08ad4dff"
            onClick={() => changeWeight(idx, false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </Button>
          <Button border="#ef4444ff" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </div>
    </TemplateModal>
  );
}
