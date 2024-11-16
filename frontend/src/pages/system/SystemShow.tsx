import { SystemData } from './types';

type Props = {
  data: SystemData;
};

export function SystemShow({ data }: Props) {
  return (
    <div id="system">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
