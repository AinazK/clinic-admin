import { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import { getFilials, updateFilial, type Filial } from "../api/filialApi";
import "./Filials.css";

export default function Filials() {
  const [filials, setFilials] = useState<Filial[]>([]);
  const [editingFilialId, setEditingFilialId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFilials = async () => {
      try {
        const list = await getFilials();
        setFilials(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilials();
  }, []);

  const handleSave = async (filial: Filial) => {
    try {
      const updated = await updateFilial(filial.id, {
        title: filial.title,
        address: filial.address,
      });
      setFilials((prev) => prev.map((f) => (f.id === filial.id ? updated : f)));
      setEditingFilialId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="filials-container">
      <Navigation />

      <div className="filials-content">
        <h2>Список филиалов</h2>

        <div className="table-wrapper">
          <table className="filials-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Адрес</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filials.map((filial) => {
                const isEditing = editingFilialId === filial.id;
                return (
                  <tr key={filial.id}>
                    <td>
                      {isEditing ? (
                        <input
                          className="inline-input"
                          type="text"
                          value={filial.title}
                          onChange={(e) =>
                            setFilials((prev) =>
                              prev.map((f) =>
                                f.id === filial.id
                                  ? { ...f, title: e.target.value }
                                  : f
                              )
                            )
                          }
                        />
                      ) : (
                        <span className="inline-text">{filial.title}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          className="inline-input"
                          type="text"
                          value={filial.address}
                          onChange={(e) =>
                            setFilials((prev) =>
                              prev.map((f) =>
                                f.id === filial.id
                                  ? { ...f, address: e.target.value }
                                  : f
                              )
                            )
                          }
                        />
                      ) : (
                        <span className="inline-text">{filial.address}</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        {isEditing ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => handleSave(filial)}
                            >
                              Сохранить
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => setEditingFilialId(null)}
                            >
                              Отмена
                            </button>
                          </>
                        ) : (
                          <button
                            className="edit-btn"
                            onClick={() => setEditingFilialId(filial.id)}
                          >
                            Редактировать
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
