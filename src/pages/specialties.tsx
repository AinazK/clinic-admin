import { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import {
  getSpecialties,
  updateSpecialty,
  type Specialty,
} from "../api/specialtiesApi";
import "./Filials.css";

export default function Specialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [editingSpecialtyId, setEditingSpecialtyId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const list = await getSpecialties();
        setSpecialties(list);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecialties();
  }, []);

  const handleSave = async (specialty: Specialty) => {
    try {
      const updated = await updateSpecialty(specialty.id, {
        title: specialty.title,
        correct_title: specialty.correct_title,
      });
      setSpecialties((prev) =>
        prev.map((s) => (s.id === specialty.id ? updated : s))
      );
      setEditingSpecialtyId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="filials-container">
      <Navigation />

      <div className="filials-content">
        <h2>Список специальностей</h2>

        <div className="table-wrapper">
          <table className="filials-table">
            <thead>
              <tr>
                <th>easy-clinic cпециальность</th>
                <th>tilda cпециальность</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {specialties.map((specialty) => {
                const isEditing = editingSpecialtyId === specialty.id;
                return (
                  <tr key={specialty.id}>
                    <td>
                      <span className="inline-text">{specialty.title}</span>
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          className="inline-input"
                          type="text"
                          value={specialty.correct_title}
                          onChange={(e) =>
                            setSpecialties((prev) =>
                              prev.map((s) =>
                                s.id === specialty.id
                                  ? { ...s, correct_title: e.target.value }
                                  : s
                              )
                            )
                          }
                        />
                      ) : (
                        <span className="inline-text">
                          {specialty.correct_title}
                        </span>
                      )}
                    </td>

                    <td className="actions-cell">
                      <div className="action-buttons">
                        {isEditing ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => handleSave(specialty)}
                            >
                              Сохранить
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => setEditingSpecialtyId(null)}
                            >
                              Отмена
                            </button>
                          </>
                        ) : (
                          <button
                            className="edit-btn"
                            onClick={() => setEditingSpecialtyId(specialty.id)}
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
