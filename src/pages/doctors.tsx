import { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import {
  getDoctors,
  getDoctorById,
  updateDoctor,
  type Doctor,
  type DoctorDocument,
} from "../api/doctorApi";
import "./Doctors.css";

export default function Doctors() {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [visibleDoctors, setVisibleDoctors] = useState<Doctor[]>([]);
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);
  const [activeDoc, setActiveDoc] = useState<DoctorDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextIndex, setNextIndex] = useState(0);

  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const doctorsList = await getDoctors();
        setAllDoctors(doctorsList);

        const firstDoctors = await Promise.all(
          doctorsList.slice(0, PAGE_SIZE).map((doc) => getDoctorById(doc.id))
        );
        setVisibleDoctors(firstDoctors);
        setNextIndex(PAGE_SIZE);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const loadMoreDoctors = async () => {
    if (nextIndex >= allDoctors.length || loading) return;

    setLoading(true);
    try {
      const nextDoctors = await Promise.all(
        allDoctors
          .slice(nextIndex, nextIndex + PAGE_SIZE)
          .map((doc) => getDoctorById(doc.id))
      );
      setVisibleDoctors((prev) => [...prev, ...nextDoctors]);
      setNextIndex(nextIndex + PAGE_SIZE);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (doctor: Doctor) => {
    const payload = {
      fio: doctor.fio,
      photo: doctor.photo,
      experience: doctor.experience,
      is_active: doctor.is_active,
      filial_ids: doctor.filials.map((f) => f.id),
      specialty_ids: doctor.specialties.map((s) => s.id),
      documents: doctor.documents.map((doc) => ({
        id: doc.id,
        file_url: doc.file_url,
        description: doc.description,
      })),
    };

    const updated = await updateDoctor(doctor.id, payload);
    setVisibleDoctors((prev) =>
      prev.map((d) => (d.id === doctor.id ? updated : d))
    );
    setEditingDoctorId(null);
  };

  const handleDocChange = (
    doctorId: number,
    docId: number,
    field: "description" | "file_url",
    value: string
  ) => {
    setVisibleDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId
          ? {
              ...d,
              documents: d.documents.map((doc) =>
                doc.id === docId ? { ...doc, [field]: value } : doc
              ),
            }
          : d
      )
    );
  };

  return (
    <div className="doctors-container">
      <Navigation />
      <div className="doctors-content">
        <h2>Список врачей</h2>

        <table className="doctors-table">
          <thead>
            <tr>
              <th>Фото</th>
              <th>ФИО</th>
              <th>Специальности</th>
              <th>Стаж</th>
              <th>Филиалы</th>
              <th>Документы</th>
              <th>Активен</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {visibleDoctors.map((doctor) => {
              const isEditing = editingDoctorId === doctor.id;
              return (
                <tr key={doctor.id}>
                  {/* фото */}
                  <td>
                    {isEditing ? (
                      <>
                        <img src={doctor.photo} alt={doctor.fio} />
                        <input
                          className="avatar"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setVisibleDoctors((prev) =>
                                prev.map((d) =>
                                  d.id === doctor.id
                                    ? { ...d, photo: reader.result as string }
                                    : d
                                )
                              );
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </>
                    ) : (
                      <img src={doctor.photo} alt={doctor.fio} />
                    )}
                  </td>

                  <td>{doctor.fio}</td>
                  <td>{doctor.specialties.map((s) => s.title).join(", ")}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="inline-input"
                        value={doctor.experience}
                        onChange={(e) =>
                          setVisibleDoctors((prev) =>
                            prev.map((d) =>
                              d.id === doctor.id
                                ? {
                                    ...d,
                                    experience: parseInt(e.target.value) || 0,
                                  }
                                : d
                            )
                          )
                        }
                      />
                    ) : (
                      doctor.experience + " лет"
                    )}
                  </td>
                  <td>{doctor.filials.map((f) => f.title).join(", ")}</td>

                  <td className="doc-item-block">
                    {doctor.documents.length > 0
                      ? doctor.documents.map((doc, index) => {
                          const isLast = index === doctor.documents.length - 1;
                          return (
                            <div className="doc-item" key={doc.id}>
                              {isEditing ? (
                                <>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const reader = new FileReader();
                                      reader.onloadend = () =>
                                        handleDocChange(
                                          doctor.id,
                                          doc.id,
                                          "file_url",
                                          reader.result as string
                                        );
                                      reader.readAsDataURL(file);
                                    }}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Описание"
                                    value={doc.description}
                                    onChange={(e) =>
                                      handleDocChange(
                                        doctor.id,
                                        doc.id,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <div className="doc-actions-row">
                                    <button
                                      className="delete-doc-btn"
                                      style={{ flex: isLast ? undefined : 1 }}
                                      onClick={() =>
                                        setVisibleDoctors((prev) =>
                                          prev.map((d) =>
                                            d.id === doctor.id
                                              ? {
                                                  ...d,
                                                  documents: d.documents.filter(
                                                    (x) => x.id !== doc.id
                                                  ),
                                                }
                                              : d
                                          )
                                        )
                                      }
                                    >
                                      Удалить
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <span
                                  className="doc-link"
                                  onClick={() => setActiveDoc(doc)}
                                >
                                  {doc.description}
                                </span>
                              )}
                            </div>
                          );
                        })
                      : null}
                    {isEditing && (
                      <button
                        className="add-doc-btn"
                        onClick={() =>
                          setVisibleDoctors((prev) =>
                            prev.map((d) =>
                              d.id === doctor.id
                                ? {
                                    ...d,
                                    documents: [
                                      ...d.documents,
                                      {
                                        id: Date.now(),
                                        file_url: "",
                                        description: "",
                                      },
                                    ],
                                  }
                                : d
                            )
                          )
                        }
                      >
                        Добавить документ
                      </button>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={doctor.is_active}
                        onChange={(e) =>
                          setVisibleDoctors((prev) =>
                            prev.map((d) =>
                              d.id === doctor.id
                                ? { ...d, is_active: e.target.checked }
                                : d
                            )
                          )
                        }
                      />
                    ) : doctor.is_active ? (
                      "Да"
                    ) : (
                      "Нет"
                    )}
                  </td>

                  <td className="actions">
                    <div className="action-buttons">
                      {isEditing ? (
                        <>
                          <button
                            className="save-btn"
                            onClick={() => handleSave(doctor)}
                          >
                            Сохранить
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setEditingDoctorId(null)}
                          >
                            Отмена
                          </button>
                        </>
                      ) : (
                        <button
                          className="edit-btn"
                          onClick={() => setEditingDoctorId(doctor.id)}
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

        {nextIndex < allDoctors.length && (
          <button
            className="button-doctor"
            onClick={loadMoreDoctors}
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Показать ещё"}
          </button>
        )}
      </div>

      {activeDoc && (
        <div className="doc-modal" onClick={() => setActiveDoc(null)}>
          <div
            className="doc-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={activeDoc.file_url} alt={activeDoc.description} />
            <p>{activeDoc.description}</p>
            <button onClick={() => setActiveDoc(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
