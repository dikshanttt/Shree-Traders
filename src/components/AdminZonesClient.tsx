"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { saveDeliveryZoneAction } from "@/actions/adminActions";
import { Plus, Check, Edit2, X, MapPin } from "lucide-react";

interface ZoneItem {
  id: string;
  zoneName: string;
  deliveryFee: number;
  active: boolean;
}

export default function AdminZonesClient({ initialZones }: { initialZones: ZoneItem[] }) {
  const [zones, setZones] = useState(initialZones);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [zoneName, setZoneName] = useState("");
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const startEdit = (z: ZoneItem) => {
    setIsCreating(false);
    setEditingId(z.id);
    setZoneName(z.zoneName);
    setDeliveryFee(z.deliveryFee);
    setActive(z.active);
  };

  const startCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setZoneName("");
    setDeliveryFee(50);
    setActive(true);
  };

  const cancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSave = async (id?: string) => {
    if (!zoneName.trim()) return;
    setLoading(true);

    const formData = new FormData();
    if (id) formData.append("id", id);
    formData.append("zoneName", zoneName.trim());
    formData.append("deliveryFee", String(deliveryFee));
    formData.append("active", String(active));

    try {
      const res = await saveDeliveryZoneAction(formData);
      if (res.success) {
        setEditingId(null);
        setIsCreating(false);
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Delivery Zone</span>
        </button>
      </div>

      {isCreating && (
        <div className="p-5 bg-white rounded-2xl border-2 border-rose-500 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Create New Delivery Zone</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Zone Name (e.g. Damak Ring Road)"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="px-3 py-2 border rounded-xl text-xs sm:col-span-2 font-medium"
            />
            <input
              type="number"
              placeholder="Fee in NPR"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
              className="px-3 py-2 border rounded-xl text-xs font-bold"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span>Zone is Active for Checkout</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave()}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
              >
                Save Zone
              </button>
              <button
                onClick={cancel}
                className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6">Zone Name</th>
              <th className="py-4 px-4">Delivery Fee (NPR)</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {zones.map((z) => {
              const isEditing = editingId === z.id;

              return (
                <tr key={z.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <input
                        type="text"
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs font-medium"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span className="font-bold text-gray-900">{z.zoneName}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
                        className="w-24 px-2 py-1.5 border rounded-lg text-xs font-bold"
                      />
                    ) : (
                      <span className="font-black text-gray-900">
                        {formatPrice(z.deliveryFee)}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {isEditing ? (
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={(e) => setActive(e.target.checked)}
                          className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span className="font-bold">Active</span>
                      </label>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          z.active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {z.active ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSave(z.id)}
                          disabled={loading}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancel}
                          className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(z)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
