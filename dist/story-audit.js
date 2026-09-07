const modalContent = document.querySelector('#modalContent');
const songButton = document.querySelector('#playSong');

const sourceSong = (id) => `https://drive.google.com/uc?export=download&id=${id}`;

function renderSongLibrary() {
  modalContent.innerHTML = `<article class="story-modal"><p class="modal-eyebrow">Melodia miasta</p><h2>♫ Piosenki Dorszolandii</h2><p>Trzy utwory Dorszolandii. Piosenki 2 i 3 mają także bezpośredni odnośnik do materiału źródłowego na Dysku.</p><section class="song-player"><h3>Piosenka Dorszolandii</h3><video controls preload="metadata"><source src="assets/stories/piosenka-dorszolandii.mp4" type="video/mp4" />Twoja przeglądarka nie obsługuje odtwarzania filmu.</video></section><section class="song-player"><h3>Piosenka Dorszolandii 2</h3><audio controls preload="metadata"><source src="${sourceSong('1bEbEMmYvLJ5LCRJaHxTyXt0nvJXP3HgA')}" type="audio/mpeg" />Twoja przeglądarka nie obsługuje odtwarzania dźwięku.</audio><a class="text-link" href="https://drive.google.com/file/d/1bEbEMmYvLJ5LCRJaHxTyXt0nvJXP3HgA/view?usp=drivesdk" target="_blank" rel="noopener">Otwórz piosenkę 2 na Dysku →</a></section><section class="song-player"><h3>Piosenka Dorszolandii 3</h3><audio controls preload="metadata"><source src="${sourceSong('1CclG0AAkXFku_KgwvCVDGV76bABHn39U')}" type="audio/mpeg" />Twoja przeglądarka nie obsługuje odtwarzania dźwięku.</audio><a class="text-link" href="https://drive.google.com/file/d/1CclG0AAkXFku_KgwvCVDGV76bABHn39U/view?usp=drivesdk" target="_blank" rel="noopener">Otwórz piosenkę 3 na Dysku →</a></section></article>`;
}

songButton?.addEventListener('click', () => setTimeout(renderSongLibrary, 0));
