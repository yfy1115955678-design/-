import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ArrowRight, Fingerprint, RefreshCcw } from 'lucide-react';

// --- Data ---
const resultsData: Record<string, { tags: string[], desc: string }> = {
  "野生造物主": {
    tags: ["#灵感永动机", "#打破与重组", "#脑内的宏大叙事"],
    desc: "别人看到的是一砖一瓦的枯燥堆砌，而你总能一眼看穿事物背后的结构，在脑海里拔地而起一座宏大的宫殿。你是一个天生的“世界架构师”。你的灵魂是完全不羁的，在别人制定的、死板的规则里当一颗螺丝钉，会让你迅速枯萎；而把你扔进一片从0到1的荒野，你反而能爆发出惊人的创造力。"
  },
  "秩序重构师": {
    tags: ["#反熵增体质", "#逻辑架构师", "#系统美学"],
    desc: "别人眼里的你可能有点“控制欲强”、“死磕流程”，但这其实是你极其稀缺的天赋——在乱局中建立系统的能力。面对一团乱麻的烂摊子，别人在焦虑，而你已经在脑海里拉出了一条清晰的进度条。你不仅能把所有的抽象概念落地成一套完美运转的 SOP，还能享受这种将无序变为有序的快感。"
  },
  "情绪炼金术士": {
    tags: ["#高敏雷达", "#情感翻译官", "#治愈结界"],
    desc: "总有人劝你“别太敏感”，但他们根本不懂，你身上装配的是一台高颗粒度的情绪雷达。在社交场上，别人只能听到表面的寒暄，而你却能精准捕捉到空气中未曾说出口的潜台词与渴望。你能把这些捕捉到的情绪碎片，转化为极其妥帖的安慰。你不是太脆弱，你是拥有一种能够穿透人心、治愈他人的魔法。"
  },
  "深海潜行者": {
    tags: ["#静谧智库", "#深度成瘾", "#灵魂独行客"],
    desc: "在一个人人都在追求短平快、喜欢凑热闹的时代，你的“冷感”和“不合群”，其实是你对深度的极致渴望。浮于表面的无效社交只会让你电量耗尽。你的世界不需要太多观众，你可以为了一个感兴趣的细节洋洋洒洒写下几千字的深度剖析。你脑海中的深邃与广阔，已经足够抵御外界的喧嚣。"
  },
  "引力捕手": {
    tags: ["#能量漩涡", "#天生C位", "#共鸣引爆器"],
    desc: "如果你曾经因为“太爱出风头”而被规训，请把那些评价扔掉。你的天赋，就是成为那个聚光灯下的核心。你天生自带一种能够感染他人的磁场。无论是在众人面前，还是在一个死气沉沉的会议室里，只要你一开口，场子的能量就会随着你的节奏起伏。你的表达欲，就是把一盘散沙凝聚在一起的最强引力。"
  },
  "世俗破壁人": {
    tags: ["#现实主义暴徒", "#目标狙击手", "#执行力天花板"],
    desc: "承认吧，你对世俗的成就、对掌控权有着本能的渴望。这绝不是什么羞耻的野心，这是你在这个世界开疆拓土的最强弹药。比起谈论虚无缥缈的情怀，你更喜欢盯着具体的进度条和最终的结果。你的字典里没有内耗，只有干脆利落的执行。你就是那个能把图纸变成金钱、把想法砸进现实的破壁者。"
  },
  "风暴舞者": {
    tags: ["#危机免疫", "#即兴主理人", "#变局捕手"],
    desc: "一眼望到头、按部就班的生活对你来说就是一场慢性窒息。在充满不确定性的危机时刻，当所有人都慌了神，你的大脑反而会进入一种极度亢奋和清晰的心流状态。你极其擅长在没有剧本的舞台上即兴发挥，随时根据突发状况给出绝佳的 B 计划。越是动荡，越能激发你的生命力。"
  },
  "极致雕刻家": {
    tags: ["#像素级控场", "#死磕到底", "#美学暴君"],
    desc: "别人觉得“差不多就行了”，但你眼里的瑕疵就像是衣服上的污渍一样刺眼。你有一种近乎残酷的完美主义，无论是打磨新产品还是输出文档，只要署了你的名字，你就绝不允许它带有任何粗糙的颗粒感。你愿意为了那最后 1% 的体验，付出 99% 的推敲。你不是在工作，你是在雕刻艺术品。"
  }
};

const questions = [
  {
    id: 1,
    title: "如果时光倒流回中学课堂，你最有可能因为什么状态被老师点名？",
    options: [
      { text: "表面在看黑板，脑子里其实在疯狂构思自己设定的故事剧情，甚至偷偷在桌底写小说。", attributes: ["野生造物主", "深海潜行者"] },
      { text: "课桌里的东西永远分门别类，甚至经常挑出老师板书的逻辑错误。", attributes: ["秩序重构师", "极致雕刻家"] },
      { text: "同桌情绪一低落你就能察觉，光顾着传纸条安慰别人，或者总和前后桌讲话。", attributes: ["情绪炼金术士", "引力捕手"] },
      { text: "觉得老师讲的解题思路太绕，直接举手提出更干脆利落的解法。", attributes: ["世俗破壁人", "风暴舞者"] }
    ]
  },
  {
    id: 2,
    title: "经历了极度消耗的一周，周末做哪件事能让你有真正的“充电感”？",
    options: [
      { text: "去看古建筑或深度看展，沉浸在自己的世界里，洋洋洒洒写下一篇长文记录和复盘。", attributes: ["深海潜行者", "野生造物主"] },
      { text: "把家里乱糟糟的房间，或者电脑里杂乱的文件夹，重新梳理建立一套极度清爽的分类系统。", attributes: ["秩序重构师", "极致雕刻家"] },
      { text: "报一个极限运动体验，或者来一场不做任何攻略、随时应对突发状况的盲盒旅行。", attributes: ["风暴舞者", "世俗破壁人"] },
      { text: "和三两知己进行一场毫无保留的深度对谈，交换彼此最隐秘的脆弱和真实。", attributes: ["情绪炼金术士", "引力捕手"] }
    ]
  },
  {
    id: 3,
    title: "回忆一下你的学生时代，每当深夜降临，你最喜欢在隐秘的个人时间里做什么？",
    options: [
      { text: "躲在被窝里看各种言情或奇幻小说，甚至会在脑海里把不同故事的剧情缝合重组。", attributes: ["野生造物主", "深海潜行者"] },
      { text: "戴着耳机听音乐，沉浸地想象自己就是那个在舞台中央发光的主唱，享受用情绪感染全场的感觉。", attributes: ["引力捕手", "情绪炼金术士"] },
      { text: "沉迷于某种策略游戏，享受那种智商碾压和打破系统限制的快感。", attributes: ["世俗破壁人", "风暴舞者"] },
      { text: "整理自己的手账或收藏品，把桌面重新归置得一丝不苟，享受在微观世界里雕刻完美的平静。", attributes: ["极致雕刻家", "秩序重构师"] }
    ]
  },
  {
    id: 4,
    title: "在一个3-5人的项目小组里，你通常会自然而然地承担起什么角色？",
    options: [
      { text: "那个把大家天马行空的想法，迅速落地成清晰可执行的 SOP 和时间线的人。", attributes: ["秩序重构师", "世俗破壁人"] },
      { text: "那个敏锐发现现有产品的痛点，迅速抛出全新改良方案或独立开发灵感的人。", attributes: ["野生造物主", "极致雕刻家"] },
      { text: "那个在大家意见不合、气氛降至冰点时，三言两语就能把场子重新暖起来的“润滑剂”。", attributes: ["情绪炼金术士", "引力捕手"] },
      { text: "那个在 DDL 前夕突然出现危机时，异常冷静并迅速给出 B 计划的“救火队长”。", attributes: ["风暴舞者", "世俗破壁人"] }
    ]
  },
  {
    id: 5,
    title: "哪种工作状态或生活场景，会让你觉得比连续熬夜三天还要“心累”？",
    options: [
      { text: "逼着你去应酬一个满是虚伪客套的饭局，强颜欢笑迎合你不认同的人。", attributes: ["深海潜行者", "情绪炼金术士"] },
      { text: "让你接手一个毫无逻辑、朝令夕改、完全没有标准化流程的烂摊子。", attributes: ["秩序重构师", "极致雕刻家"] },
      { text: "让你在一个螺丝钉岗位上，每天重复做着一眼望到头且无法发挥任何创意的死板工作。", attributes: ["野生造物主", "风暴舞者"] },
      { text: "你的野心被各种繁文缛节压制，眼睁睁看着绝佳的搞钱/晋升机会流失却无法拍板执行。", attributes: ["世俗破壁人", "引力捕手"] }
    ]
  },
  {
    id: 6,
    title: "当面对一个全新的、极其庞杂的陌生领域时，你的第一反应通常是？",
    options: [
      { text: "习惯性地寻找规律，迅速将这些杂乱的信息抽丝剥茧，梳理成思维导图。", attributes: ["秩序重构师", "世俗破壁人"] },
      { text: "一头扎进去，深挖它背后的历史渊源和底层逻辑，甚至想写一篇深度的拆解长文。", attributes: ["深海潜行者", "极致雕刻家"] },
      { text: "找这个领域里最有趣的人聊聊，通过与人的高频碰撞和交流来吸收能量。", attributes: ["引力捕手", "情绪炼金术士"] },
      { text: "快速捕捉最颠覆的几个点，脑子里立刻冒出把它和完全不搭界的东西结合起来的疯狂点子。", attributes: ["野生造物主", "风暴舞者"] }
    ]
  },
  {
    id: 7,
    title: "在团队开会或群体讨论时，哪种现象最容易让你在心里默默“翻白眼”？",
    options: [
      { text: "有人只会抛出天马行空的概念，却连个最基本的落地时间线和执行框架都给不出来。", attributes: ["秩序重构师", "世俗破壁人"] },
      { text: "为了推进项目说话毫无温度，完全无视其他成员的情绪健康，把人当机器。", attributes: ["情绪炼金术士", "引力捕手"] },
      { text: "思想极度保守，对任何稍微带点颠覆性的创新想法都条件反射般地打压。", attributes: ["野生造物主", "深海潜行者"] },
      { text: "长篇大论地说废话，开了一个小时的会却没有得出任何可执行的结论。", attributes: ["世俗破壁人", "极致雕刻家"] }
    ]
  },
  {
    id: 8,
    title: "刷社交软件时，看到起点差不多的同龄人发了怎样的状态，会让你心里有一丝最强烈的“酸”或“不甘心”？",
    options: [
      { text: "看到 TA 站在聚光灯下演出，或者在几百人面前自信闪耀地演讲，掌控全场。", attributes: ["引力捕手", "风暴舞者"] },
      { text: "看到 TA 没有去内卷，而是靠着做自己热爱的小众独立产品，赚到了人生第一桶金。", attributes: ["野生造物主", "世俗破壁人"] },
      { text: "看到 TA 把生活经营得井井有条，产出的作品毫无瑕疵，极具高级感。", attributes: ["秩序重构师", "极致雕刻家"] },
      { text: "看到 TA 出版了一本极具思想深度的书，或者发表了一篇洞察力惊人的爆款长文。", attributes: ["深海潜行者", "情绪炼金术士"] }
    ]
  },
  {
    id: 9,
    title: "当别人对你极度投入完成的作品提出尖锐批评时，你最真实的内心生理反应是？",
    options: [
      { text: "强烈的烦躁，觉得他们的反馈毫无逻辑，破坏了你构建的完美系统美感。", attributes: ["秩序重构师", "极致雕刻家"] },
      { text: "短暂的刺痛后立刻切换模式：既然游戏规则变了，看我怎么在烂牌里打出王炸。", attributes: ["风暴舞者", "世俗破壁人"] },
      { text: "陷入深深的自我怀疑，觉得他们不仅是在否定作品，更是在否定你这个人的价值。", attributes: ["情绪炼金术士", "引力捕手"] },
      { text: "表面迎合内心冷笑，你深知自己的创意太超前，这帮凡夫俗子暂时还看不懂。", attributes: ["野生造物主", "深海潜行者"] }
    ]
  },
  {
    id: 10,
    title: "如果某天你的产品大爆，获得了一笔极其丰厚的意外奖金，你脑子里冒出的第一个念头是？",
    options: [
      { text: "把这笔钱投入到一个极其稳健的复利系统中，进一步优化我的生活秩序。", attributes: ["秩序重构师", "极致雕刻家"] },
      { text: "买下那个极其昂贵的设备，或者办一场巨大的派对请所有在乎的朋友狂欢。", attributes: ["引力捕手", "情绪炼金术士"] },
      { text: "把这笔钱当成 F-you money，终于可以辞职躲起来专心写小说或研究冷门爱好了。", attributes: ["深海潜行者", "野生造物主"] },
      { text: "立刻把钱砸回去扩大规模，乘胜追击，彻底在这个赛道里把竞争对手按在地上摩擦。", attributes: ["世俗破壁人", "风暴舞者"] }
    ]
  },
  {
    id: 11,
    title: "重大项目上线前夕，系统突然崩溃，整个团队陷入极度恐慌。此时的你：",
    options: [
      { text: "迅速站到人群中央，先安抚最崩溃的核心成员，成为大家的情绪锚点。", attributes: ["情绪炼金术士", "引力捕手"] },
      { text: "瞬间抛弃所有情绪，大脑自动生成分为上中下三策的紧急SOP，精准派发任务。", attributes: ["秩序重构师", "世俗破壁人"] },
      { text: "心底涌起一丝隐秘的兴奋。无聊的常规流程被打破了，现在是纯粹的求生与即兴时间。", attributes: ["风暴舞者", "野生造物主"] },
      { text: "死死盯住备用方案的每一个细节，就算天塌下来，交付出去的东西也绝不能有低级瑕疵。", attributes: ["极致雕刻家", "深海潜行者"] }
    ]
  },
  {
    id: 12,
    title: "当你完成了一件极具挑战的事，别人怎样的夸奖最能戳中你的“爽点”？",
    options: [
      { text: "“你真的太懂我了，和你聊完我感觉整个人都被治愈了，充满能量。”", attributes: ["情绪炼金术士", "引力捕手"] },
      { text: "“你这套梳理逻辑和对细节的把控绝了，简直是教科书级别的完美交付！”", attributes: ["秩序重构师", "极致雕刻家"] },
      { text: "“你的脑洞太牛了，这种跨界结合的创意和破局思路你是怎么想出来的？”", attributes: ["野生造物主", "风暴舞者"] },
      { text: "“执行力和战略眼光太强了，这么难啃的骨头居然真被你硬生生拿下来了！”", attributes: ["世俗破壁人", "深海潜行者"] }
    ]
  },
  {
    id: 13,
    title: "手机没电、没有任何屏幕可看的长途高铁上，你要如何熬过这无聊的 3 个小时？",
    options: [
      { text: "在脑海里铺设一个极其复杂的言情或科幻小说大纲，把人物的爱恨情仇演练一遍。", attributes: ["野生造物主", "深海潜行者"] },
      { text: "反复回味最近的人际交往片段，分析某个人说话的潜台词，构思下次怎么更好地共情。", attributes: ["情绪炼金术士", "引力捕手"] },
      { text: "在脑子里给生活做减法——盘算怎么重新收纳房间，或者优化下周的工作时间线。", attributes: ["秩序重构师", "极致雕刻家"] },
      { text: "觉得这是纯粹的折磨。极度渴望外界刺激，哪怕此刻有个棘手的问题扔给你解决也好。", attributes: ["风暴舞者", "世俗破壁人"] }
    ]
  },
  {
    id: 14,
    title: "如果有充裕的时间去度长假，你最理想的旅行状态是？",
    options: [
      { text: "拒绝网红打卡，去那些有深厚历史沉淀的地方，在静谧中感受文化脉络。", attributes: ["深海潜行者", "极致雕刻家"] },
      { text: "坚定的无计划主义，享受在未知中漫步的松弛感，觉得旅途中的意外才是最棒的盲盒。", attributes: ["风暴舞者", "野生造物主"] },
      { text: "极其享受做攻略的过程，交通、备用方案全在掌控中，看着行程表被打勾会有巨大愉悦感。", attributes: ["秩序重构师", "世俗破壁人"] },
      { text: "去哪里不重要，重要的是能和契合的同伴在异国他乡的街头微醺、深夜长谈。", attributes: ["情绪炼金术士", "引力捕手"] }
    ]
  },
  {
    id: 15,
    title: "在一段极其深度的亲密关系中，伴侣的哪种行为会让你感受到最顶级的被爱？",
    options: [
      { text: "TA 可以和你安静地待在一个房间里各忙各的，完全不打扰，给你留下绝对纯粹的内心结界。", attributes: ["深海潜行者", "野生造物主"] },
      { text: "TA 能记住你极其微小的偏好细节，并给出一份完美踩在你审美点上的礼物。", attributes: ["极致雕刻家", "秩序重构师"] },
      { text: "当你在人群中闪闪发光时，TA 是台下那个用最崇拜、最热烈的眼神看着你的头号粉丝。", attributes: ["引力捕手", "情绪炼金术士"] },
      { text: "TA 像一个极其强悍的战友，能无缝补齐你的短板，让你们背靠背去对抗这个世界的麻烦。", attributes: ["世俗破壁人", "风暴舞者"] }
    ]
  }
];

const initialScores = {
  "野生造物主": 0,
  "秩序重构师": 0,
  "情绪炼金术士": 0,
  "深海潜行者": 0,
  "引力捕手": 0,
  "世俗破壁人": 0,
  "风暴舞者": 0,
  "极致雕刻家": 0
};

// --- App Component ---
export default function App() {
  const [view, setView] = useState<'HOME' | 'QUIZ' | 'LOADING' | 'RESULT'>('HOME');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);
  const [matchRate, setMatchRate] = useState<number>(96);

  useEffect(() => {
    if (view === 'LOADING') {
      const timer = setTimeout(() => {
        setMatchRate(Math.floor(Math.random() * 10) + 90); // 90-99
        setView('RESULT');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleStart = () => {
    setView('QUIZ');
  };

  const handleOptionClick = (optionIndex: number, attributes: string[]) => {
    if (selectedOptionIndex !== -1) return; // Prevent multiple clicks
    setSelectedOptionIndex(optionIndex);

    setScores(prev => {
      const newScores = { ...prev };
      attributes.forEach(attr => {
        newScores[attr] += 1;
      });
      return newScores;
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOptionIndex(-1);
      } else {
        setView('LOADING');
      }
    }, 500);
  };

  const getResult = () => {
    let maxScore = -1;
    let dominantTrait = '';
    for (const [trait, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        dominantTrait = trait;
      }
    }
    return dominantTrait || "野生造物主";
  };

  const restartTest = () => {
    setScores(initialScores);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(-1);
    setView('HOME');
  };

  const renderHome = () => (
    <motion.div 
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center bg-[#FAFAFA]"
    >
      <div className="mb-16 relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 -left-10 text-[#D4CFC4]"
        >
          <Sparkles size={80} strokeWidth={1} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-[2.2rem] md:text-5xl font-bold leading-tight mb-5 text-[#333333] tracking-widest relative z-10">
            你的隐藏<br/>天赋挖掘机
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#666666] text-sm md:text-base leading-relaxed max-w-[240px] mx-auto font-light tracking-wide"
        >
          测一测你被社会规训前，<br/>最原始的底层能力。
        </motion.p>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        className="relative group bg-[#333333] text-[#FAFAFA] px-10 py-4 rounded-full font-medium text-[15px] flex items-center space-x-3 overflow-hidden"
      >
        <motion.div 
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-100%]"
        />
        <span className="tracking-widest relative z-10">开始测试</span>
        <ArrowRight size={18} className="relative z-10" />
      </motion.button>
    </motion.div>
  );

  const renderQuiz = () => {
    const question = questions[currentQuestionIndex];
    return (
      <motion.div 
        key={`quiz-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col min-h-[100dvh] p-6 max-w-md mx-auto bg-[#FAFAFA]"
      >
        <div className="pt-8 mb-8 flex-shrink-0">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] text-[#999999] font-semibold tracking-[0.2em] uppercase">Progress</span>
            <span className="text-sm text-[#333333] font-medium tracking-widest">{currentQuestionIndex + 1} <span className="text-[#999999] font-light">/ {questions.length}</span></span>
          </div>
          <div className="h-[3px] w-full bg-[#EAEAEA] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full bg-[#333333]"
            />
          </div>
        </div>

        <div className="mb-10 flex-shrink-0">
          <h2 className="text-[1.15rem] md:text-xl font-medium leading-relaxed text-[#333333] tracking-wide text-justify">
            {question.title}
          </h2>
        </div>

        <div className="space-y-4 flex-1 pb-8">
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isOtherSelected = selectedOptionIndex !== -1 && !isSelected;
            
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionClick(idx, option.attributes)}
                disabled={selectedOptionIndex !== -1}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? 'border-[#333333] bg-[#F5F2EC] shadow-[0_4px_12px_rgba(0,0,0,0.05)] scale-[1.01]' 
                    : isOtherSelected
                      ? 'border-transparent bg-white opacity-40'
                      : 'border-transparent bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                }`}
              >
                <p className={`text-[14px] leading-relaxed tracking-wide ${
                  isSelected ? 'text-[#333333] font-medium' : 'text-[#555555] font-light'
                }`}>
                  {option.text}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderLoading = () => (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center bg-[#FAFAFA]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-[#E0D8C8] blur-xl opacity-30 rounded-full mix-blend-multiply"></div>
        <Loader2 size={42} strokeWidth={1.5} className="text-[#333333] relative z-10" />
      </motion.div>
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="space-y-2"
      >
        <p className="text-[#333333] text-[15px] tracking-widest font-medium">正在深入你的潜意识网络</p>
        <p className="text-[#888888] text-xs tracking-wider font-light">生成个人天赋说明书...</p>
      </motion.div>
    </motion.div>
  );

  const renderResult = () => {
    const dominantTrait = getResult();
    const resultInfo = resultsData[dominantTrait];

    return (
      <motion.div 
        key="result"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col min-h-[100dvh] p-6 max-w-md mx-auto bg-[#FAFAFA] relative overflow-hidden"
      >
        {/* Abstract Background Elements */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#EBE5D9] rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none transition-all duration-1000" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#E0E2E5] rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none transition-all duration-1000" />

        <div className="relative z-10 pt-10 pb-6 flex-1 flex flex-col items-center">
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center w-full"
          >
            <div className="inline-flex items-center space-x-1.5 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-[11px] font-medium text-[#555] mb-8 shadow-sm border border-white/50">
              <Fingerprint size={12} className="opacity-70" />
              <span className="tracking-widest uppercase">潜意识灵魂匹配度：<span className="font-bold text-[#333]">{matchRate}%</span></span>
            </div>
            
            <h1 className="text-[2.5rem] md:text-5xl font-black text-[#333333] tracking-tight mb-8">
              {dominantTrait}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2.5 mb-8">
              {resultInfo.tags.map((tag, idx) => (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  key={idx} 
                  className="bg-[#333333] text-[#FAFAFA] px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="w-full flex-1"
          >
            <div className="bg-white/50 backdrop-blur-xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2rem] p-8 h-full relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1.5 bg-[#EAEAEA] rounded-full"></div>
              <div className="absolute top-6 left-6 text-[#EAEAEA]">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                   <path d="M10 11L8 15H11V17H5V11L7 7H10L8 11H10ZM18 11L16 15H19V17H13V11L15 7H18L16 11H18Z" />
                 </svg>
              </div>
              
              <p className="text-[#444444] text-[14px] md:text-[15px] leading-[2.2] text-justify font-light mt-4 relative z-10 tracking-wide">
                {resultInfo.desc}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-8 text-center flex flex-col items-center"
          >
            <p className="text-[10px] text-[#999] mb-6 tracking-widest uppercase">长按保存图片分享</p>
            <button 
              onClick={restartTest}
              className="flex items-center space-x-2 text-[12px] font-medium text-[#666] hover:text-[#333] transition-colors"
            >
              <RefreshCcw size={12} />
              <span className="tracking-widest border-b border-[#ccc] pb-0.5">重新测试</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#FAFAFA] text-[#333333] font-sans selection:bg-[#E0D8C8] selection:text-[#333333] overflow-x-hidden relative">
      <AnimatePresence mode="wait">
        {view === 'HOME' && renderHome()}
        {view === 'QUIZ' && renderQuiz()}
        {view === 'LOADING' && renderLoading()}
        {view === 'RESULT' && renderResult()}
      </AnimatePresence>
    </main>
  );
}
