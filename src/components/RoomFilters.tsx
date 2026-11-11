import { SlidersHorizontal } from 'lucide-react';
import { EQUIPMENT_OPTIONS, type RoomFilters as RoomFilterValues } from '@/lib/roomFilters';

interface RoomFiltersProps {
  value: RoomFilterValues;
  onChange: (next: RoomFilterValues) => void;
}

export default function RoomFilters({ value, onChange }: RoomFiltersProps) {
  const toggleEquipment = (item: string) => {
    const requiredEquipment = value.requiredEquipment.includes(item)
      ? value.requiredEquipment.filter((equipment) => equipment !== item)
      : [...value.requiredEquipment, item];

    onChange({ ...value, requiredEquipment });
  };

  return (
    <section aria-label="Room filters" className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-primary-600" />
        <h3 className="text-sm font-bold text-slate-700">Find a suitable room</h3>
      </div>

      <div>
        <label htmlFor="minimum-capacity" className="mb-1.5 block text-sm font-medium text-slate-600">
          Minimum capacity (attendees)
        </label>
        <input
          id="minimum-capacity"
          type="number"
          min="0"
          value={value.minimumCapacity}
          onChange={(event) =>
            onChange({ ...value, minimumCapacity: Math.max(0, Number(event.target.value) || 0) })
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-600">Required equipment</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {EQUIPMENT_OPTIONS.map((item) => (
            <label key={item} className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={value.requiredEquipment.includes(item)}
                onChange={() => toggleEquipment(item)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={() => onChange({ minimumCapacity: 0, requiredEquipment: [] })}
        className="text-xs font-semibold text-primary-700 underline-offset-2 hover:underline"
      >
        Clear filters
      </button>
    </section>
  );
}
