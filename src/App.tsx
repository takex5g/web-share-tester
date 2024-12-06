import { useState, useEffect, useMemo } from 'react';
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
    //Debug
    setCanShare(true);
  }, []);

  const [imgFile, setImgFile] = useState<File | null>(null);
  useEffect(() => {
    const fetchImage = async () => {

        const blob = await fetch('/web-share-tester/image.jpg').then((res) => res.blob());
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        setImgFile(file);
    }
    fetchImage();
  }
  , []);

  // shareDataをuseMemoで管理
  const shareData = useMemo<ShareData>(() => {
    const data: ShareData = {};

    if (selectedOptions.text) {
      data.text = 'シェアするテキスト #ハッシュタグ も付与';
    }

    if (selectedOptions.url) {
      data.url = window.location.href; // 現在のウェブサイトのURL
    }

    if (selectedOptions.image) {
      // 画像ファイルを取得
      if(!imgFile) return data;
      data.files = [
        new File(
          [imgFile],
          'image.jpg',
          { type: 'image/jpeg' }
        ),
      ];
    }

    return data;
  }, [selectedOptions,imgFile]); // selectedOptionsの変更時に再計算

  const handleShare = async () => {
    try {
      // shareDataに内容があればWeb Share APIを使ってシェア
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

      {canShare && (
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
          <div style={{ border: '1px solid black', padding: '10px', marginTop: '10px' }}>
            <h3>シェアデータ</h3>
            <p>テキスト: {shareData.text}</p>
            <p>URL: {shareData.url}</p>
            <p>ファイル: {shareData.files?.length}個</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
