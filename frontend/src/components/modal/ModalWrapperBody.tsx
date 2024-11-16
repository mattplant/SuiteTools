import { ModalWrapperBodyData } from './ModalWrapperBodyData';
import { ModalTypes } from './types';

type Props = {
  type: ModalTypes;
  loading: boolean;
  data: unknown;
};

export function ModalWrapperBody({ type, loading, data }: Props) {
  return (
    <div className="p-6 space-y-6">
      <div id="script-modal-content" className="text-base leading-relaxed text-gray-500">
        <ModalWrapperBodyData type={type} loading={loading} data={data} />
      </div>
    </div>
  );
}
