import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import { AVAILABLE_PLACES } from './data';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import logoImg from './assets/logo.png';
import { Places } from './components/Places';
import { sortPlacesByDistance } from './loc';
import { extractPlaceIds } from './utils/helper';

let storedPlacesStr = localStorage.getItem('pickedPlaces') ?? JSON.stringify([]);
    
function App() {
  const storedIds = extractPlaceIds(storedPlacesStr);
  const storedPlaces = AVAILABLE_PLACES.filter((p: any) => storedIds.includes(p.id));
  const selectedPlace = useRef<any>();
  const [pickedPlaces, setPickedPlaces] = useState<any[]>(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState<any[]>([]);
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  useEffect(() => {
    const storedPlacesStr = localStorage.getItem('pickedPlaces') || '';
    const storedIds = extractPlaceIds(storedPlacesStr);
    setPickedPlaces(
      AVAILABLE_PLACES.filter((p: any) => storedIds.includes(p.id))
    );
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position: any) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitutude,
      );
  
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id: number | undefined) {
    setIsModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsModalOpen(false);
  }

  function handleSelectPlace(id: string) {
    setPickedPlaces((prevPickedPlaces: any) => {
      if (prevPickedPlaces.some((place: any) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedPlaces = localStorage.getItem('pickedPlaces') || '';
    const storedIds = extractPlaceIds(storedPlaces);
    if (!storedIds.includes(id)) {
      storedIds.push(id);
      localStorage.setItem('pickedPlaces', JSON.stringify(storedIds));
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place: any) => place.id !== selectedPlace.current)
    );
    setIsModalOpen(false);

    const pickedPlaces = localStorage.getItem('pickedPlaces');
    const storedIds =  pickedPlaces ? JSON.parse(pickedPlaces): [];
    localStorage.setItem(
      'pickedPlaces',
      JSON.stringify(storedIds.filter((id: string) => id !== selectedPlace.current))
    )
  }, []); 

  return (
    <>
      <Modal open={isModalOpen} onClosingModal={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Loading the places according to your location..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}
export default App;
