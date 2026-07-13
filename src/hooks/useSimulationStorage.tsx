import {
  type SimulationFormData,
  type SimulationRecord,
} from "@/data/simulation";

const LOCAL_STORAGE_KEY = "simulation-data";

const getChatStorageKey = (simulationId: string) =>
  `simulation-chat-${simulationId}`;

function getSavedSimulations() {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!storage) {
    return [];
  }

  return JSON.parse(storage) as SimulationRecord[];
}

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID();

    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
    };

    const savedData = getSavedSimulations();

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    );

    return id;
  };

  const getAllSimulations = () => {
    return getSavedSimulations();
  };

  const getFormData = (id: string) => {
    const savedData = getSavedSimulations();

    return savedData.find((record) => record.id === id) || null;
  };

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const savedData = getSavedSimulations();

    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    );

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteSimulation = (id: string) => {
    const savedData = getSavedSimulations();

    const updated = savedData.filter((record) => record.id !== id);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    localStorage.removeItem(getChatStorageKey(id));
  };

  return {
    saveFormData,
    getAllSimulations,
    getFormData,
    updateSimulation,
    deleteSimulation,
  };
};