import { useState, useEffect } from 'react';
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
  const { toast } = useToast();

  const [newBirthdayName, setNewBirthdayName] = useState('');
  const [newBirthdayDate, setNewBirthdayDate] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const time = formatTime(currentTime);
  const timeLeft = selectedBirthday ? calculateTimeLeft(selectedBirthday.date) : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-9xl font-bold mb-8 animate-scale-in" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🎉 С Днём рождения! 🎉
            </h1>
            <h2 className="text-4xl md:text-7xl font-semibold animate-fade-in" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {celebrationName}
            </h2>
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][
                      Math.floor(Math.random() * 6)
                    ],
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
                  className="absolute top-6 right-6 text-white hover:bg-white hover:text-black"
                >
                  <Icon name="X" size={24} />
                </Button>
                <h2 className="text-3xl md:text-5xl mb-4 font-light" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                          <Label htmlFor="name">Имя</Label>
                          <Input
                            id="name"
                            value={newBirthdayName}
                            onChange={(e) => setNewBirthdayName(e.target.value)}
                            placeholder="Введите имя"
                            className="bg-black border-white text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="date">Дата</Label>
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
          animation: confetti-fall 3s linear infinite;
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
