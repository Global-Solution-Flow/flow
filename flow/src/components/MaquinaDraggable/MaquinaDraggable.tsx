import { useDraggable } from "@dnd-kit/core";
import type { Maquina } from "../../data/Mocks";

type Props = { maquina: Maquina };

export default function MaquinaDraggable({ maquina }: Props) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `lib-${maquina.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-3 bg-gray-200 rounded-lg shadow-md cursor-grab active:cursor-grabbing text-black"
    >
      {maquina.nome}
    </div>
  );
}
