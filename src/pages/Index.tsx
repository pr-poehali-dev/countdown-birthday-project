import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Birthday {
  id: string;
  name: string;
  date: Date;
}

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState<'main' | 'birthday'>('main');
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationName, setCelebrationName] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  const [newBirthdayName, setNewBirthdayName] = useState('');
  const [newBirthdayDate, setNewBirthdayDate] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const celebrationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    celebrationAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    celebrationAudioRef.current.volume = 0.5;

    return () => {
      audioRef.current?.pause();
      celebrationAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedBirthday) {
      const now = new Date();
      const targetDate = new Date(selectedBirthday.date);
      
      if (
        now.getDate() === targetDate.getDate() &&
        now.getMonth() === targetDate.getMonth() &&
        now.getFullYear() === targetDate.getFullYear() &&
        now.getHours() === 0 &&
        now.getMinutes() === 0 &&
        now.getSeconds() === 0
      ) {
        setCelebrationName(selectedBirthday.name);
        setShowCelebration(true);
        celebrationAudioRef.current?.play();
        setTimeout(() => setShowCelebration(false), 10000);
      }
    }
  }, [currentTime, selectedBirthday]);

  const formatTime = (date: Date) => {
    const moscowTime = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
    return {
      hours: String(moscowTime.getHours()).padStart(2, '0'),
      minutes: String(moscowTime.getMinutes()).padStart(2, '0'),
      seconds: String(moscowTime.getSeconds()).padStart(2, '0'),
    };
  };

  const calculateTimeLeft = (targetDate: Date) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const addBirthday = () => {
    if (!newBirthdayName || !newBirthdayDate) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const newBirthday: Birthday = {
      id: Date.now().toString(),
      name: newBirthdayName,
      date: new Date(newBirthdayDate),
    };

    setBirthdays([...birthdays, newBirthday]);
    setNewBirthdayName('');
    setNewBirthdayDate('');
    setIsDialogOpen(false);
    toast({
      title: 'Успешно!',
      description: `День рождения ${newBirthdayName} добавлен`,
    });
  };

  const deleteBirthday = (id: string) => {
    setBirthdays(birthdays.filter((b) => b.id !== id));
    if (selectedBirthday?.id === id) {
      setSelectedBirthday(null);
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const time = formatTime(currentTime);
  const timeLeft = selectedBirthday ? calculateTimeLeft(selectedBirthday.date) : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 animate-fade-in">
          <div className="text-center">
            <h1 className="text-6xl md:text-9xl font-bold mb-8 animate-scale-in celebration-glow" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🎉 С Днём рождения! 🎉
            </h1>
            <h2 className="text-4xl md:text-7xl font-semibold animate-fade-in celebration-text" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {celebrationName}
            </h2>
            <div className="confetti-container">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff6b6b', '#4ecdc4'][
                      Math.floor(Math.random() * 8)
                    ],
                  }}
                />
              ))}
            </div>
            <div className="fireworks-container">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="firework"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-6 left-6 flex gap-4 z-10">
        <Button
          variant={activeCategory === 'main' ? 'default' : 'outline'}
          onClick={() => {
            setActiveCategory('main');
            setSelectedBirthday(null);
          }}
          className={activeCategory === 'main' ? 'bg-white text-black hover:bg-gray-200' : 'border-white text-white hover:bg-white hover:text-black'}
        >
          Основное
        </Button>
        <Button
          variant={activeCategory === 'birthday' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('birthday')}
          className={activeCategory === 'birthday' ? 'bg-white text-black hover:bg-gray-200' : 'border-white text-white hover:bg-white hover:text-black'}
        >
          Дни рождения
        </Button>
      </div>

      <div className="absolute top-6 right-6 flex gap-4 z-10">
        <Button
          variant="outline"
          onClick={toggleMusic}
          className="border-white text-white hover:bg-white hover:text-black"
          title={isMusicPlaying ? 'Выключить музыку' : 'Включить музыку'}
        >
          <Icon name={isMusicPlaying ? 'Volume2' : 'VolumeX'} size={20} />
        </Button>
        <Button
          variant="outline"
          onClick={toggleFullscreen}
          className="border-white text-white hover:bg-white hover:text-black"
          title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
        >
          <Icon name={isFullscreen ? 'Minimize2' : 'Maximize2'} size={20} />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        {activeCategory === 'main' ? (
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl mb-8 font-light" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Московское время
            </h2>
            <div className="flex gap-4 md:gap-8 justify-center" style={{ fontFamily: 'Roboto Mono, monospace' }}>
              <div className="flex flex-col items-center">
                <span className="text-8xl md:text-[200px] font-bold leading-none">{time.hours}</span>
                <span className="text-xl md:text-3xl mt-4 text-gray-400">часы</span>
              </div>
              <span className="text-8xl md:text-[200px] font-bold animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <span className="text-8xl md:text-[200px] font-bold leading-none">{time.minutes}</span>
                <span className="text-xl md:text-3xl mt-4 text-gray-400">минуты</span>
              </div>
              <span className="text-8xl md:text-[200px] font-bold animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <span className="text-8xl md:text-[200px] font-bold leading-none">{time.seconds}</span>
                <span className="text-xl md:text-3xl mt-4 text-gray-400">секунды</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            {selectedBirthday ? (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedBirthday(null)}
                  className="absolute top-6 right-32 text-white hover:bg-white hover:text-black"
                >
                  <Icon name="X" size={24} />
                </Button>
                <h2 className="text-3xl md:text-5xl mb-4 font-light text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  День рождения
                </h2>
                <h3 className="text-4xl md:text-6xl mb-12 font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {selectedBirthday.name}
                </h3>
                {timeLeft && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    <div className="flex flex-col items-center">
                      <span className="text-6xl md:text-8xl font-bold">{timeLeft.days}</span>
                      <span className="text-xl md:text-2xl mt-4 text-gray-400">дней</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-6xl md:text-8xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-xl md:text-2xl mt-4 text-gray-400">часов</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-6xl md:text-8xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-xl md:text-2xl mt-4 text-gray-400">минут</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-6xl md:text-8xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-xl md:text-2xl mt-4 text-gray-400">секунд</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl md:text-5xl font-light" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Список дней рождений
                  </h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-black hover:bg-gray-200">
                        <Icon name="Plus" size={20} className="mr-2" />
                        Добавить
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-white text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white">Новый день рождения</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-white">Имя</Label>
                          <Input
                            id="name"
                            value={newBirthdayName}
                            onChange={(e) => setNewBirthdayName(e.target.value)}
                            placeholder="Введите имя"
                            className="bg-black border-white text-white placeholder:text-gray-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="date" className="text-white">Дата</Label>
                          <Input
                            id="date"
                            type="datetime-local"
                            value={newBirthdayDate}
                            onChange={(e) => setNewBirthdayDate(e.target.value)}
                            className="bg-black border-white text-white"
                          />
                        </div>
                        <Button onClick={addBirthday} className="w-full bg-white text-black hover:bg-gray-200">
                          Сохранить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {birthdays.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Icon name="Cake" size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-xl">Нет добавленных дней рождений</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {birthdays.map((birthday) => (
                      <div
                        key={birthday.id}
                        className="border border-white p-6 rounded-lg flex justify-between items-center hover:bg-white hover:text-black transition-all cursor-pointer group"
                        onClick={() => setSelectedBirthday(birthday)}
                      >
                        <div>
                          <h3 className="text-2xl font-semibold mb-2">{birthday.name}</h3>
                          <p className="text-gray-400 group-hover:text-gray-700">
                            {birthday.date.toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBirthday(birthday.id);
                          }}
                          className="text-white group-hover:text-black hover:bg-gray-200"
                        >
                          <Icon name="Trash2" size={20} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Montserrat:wght@300;400;600;700&display=swap');

        .confetti-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall linear infinite;
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(110vh) rotate(720deg);
          }
        }

        .fireworks-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .firework {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          box-shadow: 
            0 0 20px 10px #ff0,
            0 0 40px 20px #f0f,
            0 0 60px 30px #0ff;
          animation: firework-explosion 2s ease-out infinite;
        }

        @keyframes firework-explosion {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(30);
            opacity: 0;
          }
        }

        .celebration-glow {
          text-shadow: 
            0 0 20px rgba(255, 255, 255, 0.8),
            0 0 40px rgba(255, 255, 255, 0.6),
            0 0 60px rgba(255, 255, 255, 0.4);
          animation: glow-pulse 1.5s ease-in-out infinite;
        }

        .celebration-text {
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.8);
        }

        @keyframes glow-pulse {
          0%, 100% {
            text-shadow: 
              0 0 20px rgba(255, 255, 255, 0.8),
              0 0 40px rgba(255, 255, 255, 0.6),
              0 0 60px rgba(255, 255, 255, 0.4);
          }
          50% {
            text-shadow: 
              0 0 30px rgba(255, 255, 255, 1),
              0 0 60px rgba(255, 255, 255, 0.8),
              0 0 90px rgba(255, 255, 255, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
