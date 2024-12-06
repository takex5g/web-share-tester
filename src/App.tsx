import { useState, useEffect } from 'react';
import './App.css';

type ShareData = {
  text?: string;
  url?: string;
  files?: File[];
};
function App() {
  const [canShare, setCanShare] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    text: false,
    image: false,
    url: false,
  });

  useEffect(() => {
    // Web Share APIが利用可能かどうかをチェック
    if (navigator.canShare()) {
      setCanShare(true);
    }
  }, []);

  const handleShare = async () => {
    try {
      const shareData: ShareData = {};

      // テキストが選択されていれば追加
      if (selectedOptions.text) {
        shareData.text = 'こちらはテキストのサンプルです';
      }

      // 画像が選択されていれば追加
      if (selectedOptions.image) {
        shareData.files = [
          new File(
            [await fetch('/image.jpg').then((res) => res.blob())],
            'image.jpg',
            { type: 'image/jpeg' }
          ),
        ];
      }

      // URLが選択されていれば現在のURLを追加
      if (selectedOptions.url) {
        shareData.url = window.location.href; // 現在のウェブサイトのURL
      }

      // Web Share APIを使ってシェア
      if (Object.keys(shareData).length > 0) {
        await navigator.share(shareData);
        window.alert('シェアしました');
      }
    } catch (err) {
      console.error('シェアエラー:', err);
      window.alert('シェアに失敗しました');
    }
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className='App'>
      <h1>Web Share API チェック</h1>

      {!canShare && <p>Web Share APIはサポートされていません</p>}
      {/* {canShare ? ( */}
      <div>
        <h2>シェア内容を選択してください:</h2>
        <form>
          <label>
            <input
              type='checkbox'
              name='text'
              checked={selectedOptions.text}
              onChange={handleCheckboxChange}
            />
            テキスト
          </label>
          <br />
          <label>
            <input
              type='checkbox'
              name='image'
              checked={selectedOptions.image}
              onChange={handleCheckboxChange}
            />
            画像
          </label>
          <br />
          <label>
            <input
              type='checkbox'
              name='url'
              checked={selectedOptions.url}
              onChange={handleCheckboxChange}
            />
            URL
          </label>
        </form>

        <button onClick={handleShare}>シェア</button>
      </div>
      {/* ) : (
        <p>Web Share APIはサポートされていません</p>
      )} */}
    </div>
  );
}

export default App;
