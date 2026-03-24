import { useState } from 'react';
import Icon from '@/components/ui/icon';

const TOPICS = [
  {
    id: 1,
    title: 'Единицы измерения информации',
    icon: '💾',
    color: 'from-purple-500 to-indigo-600',
    sections: [
      {
        title: 'Основные единицы',
        content: `• 1 бит (bit) — минимальная единица информации (0 или 1)
• 1 байт (byte) = 8 бит
• 1 КБ (килобайт) = 1024 байт = 2¹⁰ байт
• 1 МБ (мегабайт) = 1024 КБ = 2²⁰ байт
• 1 ГБ (гигабайт) = 1024 МБ = 2³⁰ байт
• 1 ТБ (терабайт) = 1024 ГБ`,
      },
      {
        title: 'Формула объёма данных',
        content: `V = n × i
Где: n — количество символов/пикселей, i — количество бит на символ

Пример: текст 1000 символов в Unicode (2 байта/символ):
V = 1000 × 2 = 2000 байт = 1,95 КБ

Формула для изображения:
V = ширина × высота × глубина_цвета (в байтах)`,
      },
    ],
  },
  {
    id: 2,
    title: 'Кодирование информации',
    icon: '🔐',
    color: 'from-cyan-500 to-blue-600',
    sections: [
      {
        title: 'Таблица ASCII',
        content: `ASCII — American Standard Code for Information Interchange
• Цифры: 0→48, 1→49, ... 9→57
• Заглавные: A→65, B→66, ... Z→90
• Строчные: a→97, b→98, ... z→122
• Пробел: 32

Каждый символ = 1 байт (8 бит)`,
      },
      {
        title: 'Шифр Цезаря',
        content: `Каждая буква сдвигается на N позиций в алфавите.
Сдвиг +3: А→Д, Б→Е, В→Ж, Г→З...

Пример (сдвиг +3):
КОТ → НРШ
(К+3=Н, О+3=Р, Т+3=Ш)

Дешифрование: применить обратный сдвиг (-3)`,
      },
    ],
  },
  {
    id: 3,
    title: 'Системы счисления',
    icon: '🔢',
    color: 'from-fuchsia-500 to-pink-600',
    sections: [
      {
        title: 'Перевод в десятичную',
        content: `Двоичная (основание 2):
1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰
     = 8 + 0 + 2 + 1 = 11₁₀

Восьмеричная (основание 8):
17₈ = 1×8 + 7 = 15₁₀

Шестнадцатеричная (основание 16):
A=10, B=11, C=12, D=13, E=14, F=15
1F₁₆ = 1×16 + 15 = 31₁₀`,
      },
      {
        title: 'Перевод из десятичной',
        content: `Делить на основание, записывать остатки снизу вверх:

25₁₀ → двоичная:
25 ÷ 2 = 12 ост. 1
12 ÷ 2 = 6 ост. 0
6 ÷ 2 = 3 ост. 0
3 ÷ 2 = 1 ост. 1
1 ÷ 2 = 0 ост. 1
Читаем снизу вверх: 11001₂`,
      },
    ],
  },
  {
    id: 4,
    title: 'Алгоритмы и программирование',
    icon: '⚙️',
    color: 'from-pink-500 to-rose-600',
    sections: [
      {
        title: 'Типы алгоритмов',
        content: `• Линейный — команды выполняются по порядку
• Ветвящийся — с условным оператором (if/else)
• Циклический — команды повторяются (for, while)
• Рекурсивный — алгоритм вызывает сам себя

Трассировка — ручное пошаговое выполнение
алгоритма с записью значений переменных.`,
      },
      {
        title: 'Условный оператор',
        content: `if условие:
    действие_1
else:
    действие_2

Пример:
if x > 0:
    print("положительное")
else:
    print("не положительное")

Логические операторы: И (and), ИЛИ (or), НЕ (not)`,
      },
    ],
  },
  {
    id: 5,
    title: 'Графы и маршруты',
    icon: '🗺️',
    color: 'from-orange-500 to-amber-600',
    sections: [
      {
        title: 'Основные понятия',
        content: `Граф — множество вершин (узлов) и рёбер (связей).

• Ориентированный граф — рёбра имеют направление
• Взвешенный граф — рёбрам присвоены числа (расстояния)
• Смежные вершины — соединены ребром напрямую
• Степень вершины — количество рёбер из неё
• Дерево — связный граф без циклов`,
      },
      {
        title: 'Подсчёт путей',
        content: `Метод динамического программирования:
Количество путей в вершину = сумма путей
во все предыдущие смежные вершины.

Пример: А→Б, А→В, Б→Г, В→Г
paths[А] = 1
paths[Б] = paths[А] = 1
paths[В] = paths[А] = 1  
paths[Г] = paths[Б] + paths[В] = 2`,
      },
    ],
  },
  {
    id: 6,
    title: 'Интернет и адресация',
    icon: '🌐',
    color: 'from-sky-500 to-cyan-600',
    sections: [
      {
        title: 'Структура URL',
        content: `протокол://домен/путь/файл.расширение

Пример: https://school.ru/math/task.html
• Протокол: https
• Домен: school.ru  
• Путь: /math/
• Файл: task.html
• Расширение: html

Протоколы: http, https (защищённый), ftp (файлы)`,
      },
      {
        title: 'Поисковые запросы',
        content: `Логические операторы поиска:
• И (AND) — пересечение: ОБА слова на странице
• ИЛИ (OR) — объединение: хотя бы одно слово
• НЕ (NOT) — исключение слова

Формула: A ИЛИ B = A + B − (A И B)

Пример: "лето"=5000, "море"=4000, "лето И море"=2000
"лето ИЛИ море" = 5000 + 4000 − 2000 = 7000`,
      },
    ],
  },
  {
    id: 7,
    title: 'Файловые системы',
    icon: '📁',
    color: 'from-teal-500 to-emerald-600',
    sections: [
      {
        title: 'Расширения файлов',
        content: `Тип файла определяется расширением:
• .txt — текстовый файл
• .doc, .docx — документ Word
• .xls, .xlsx — таблица Excel
• .jpg, .png, .bmp — изображения
• .htm, .html — веб-страница
• .exe — исполняемый файл
• .mp3, .wav — аудио
• .mp4, .avi — видео`,
      },
      {
        title: 'Поиск файлов (маски)',
        content: `Маска — шаблон для поиска файлов:
• * — любое количество любых символов
• ? — ровно один любой символ

Примеры:
• *.jpg — все файлы с расширением .jpg
• photo?.jpg — photo1.jpg, photoA.jpg
• report* — все файлы, начинающиеся с report
• *.* — все файлы с расширением`,
      },
    ],
  },
];

export default function Theory() {
  const [activeTopic, setActiveTopic] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Теория</h1>
        <p className="text-white/50">Все темы ОГЭ по информатике в одном месте</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map((topic) => (
          <div key={topic.id} className="card-glow rounded-2xl overflow-hidden">
            <button
              onClick={() => setActiveTopic(activeTopic === topic.id ? null : topic.id)}
              className="w-full p-6 text-left flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                {topic.icon}
              </div>
              <div className="flex-1">
                <div className="text-white font-bold mb-1">{topic.title}</div>
                <div className="text-white/40 text-xs">{topic.sections.length} раздела</div>
              </div>
              <Icon
                name={activeTopic === topic.id ? 'ChevronUp' : 'ChevronDown'}
                size={18}
                className="text-white/40 flex-shrink-0 mt-1"
              />
            </button>

            {activeTopic === topic.id && (
              <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-4">
                {topic.sections.map((section) => (
                  <div key={section.title}>
                    <div className="text-white/70 text-sm font-semibold mb-2">{section.title}</div>
                    <pre className="text-white/60 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-white/5 rounded-xl p-3">
                      {section.content}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 card-glow rounded-2xl p-6">
        <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-amber-400" />
          Советы по подготовке к ОГЭ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { tip: 'Запомни степени двойки: 2⁰=1, 2¹=2, 2²=4, ..., 2¹⁰=1024, 2²⁰=1048576' },
            { tip: 'ASCII: A=65 (заглавная), a=97 (строчная). Разница = 32' },
            { tip: 'Шестнадцатеричные цифры: 0-9, A=10, B=11, C=12, D=13, E=14, F=15' },
            { tip: 'Формула поиска: A ИЛИ B = A + B - (A И B). Никогда не превышает A+B' },
            { tip: 'URL структура: протокол://домен.зона/папка/файл.расширение' },
            { tip: 'При трассировке записывай значения ВСЕХ переменных на каждом шаге' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 text-sm text-white/60">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs flex-shrink-0 mt-0.5">{i + 1}</div>
              {item.tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
