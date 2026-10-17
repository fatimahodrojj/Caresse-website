-- Therapists move from static files to the database. Seeds the current team
-- exactly as shown on the site (English and Arabic).

-- CreateEnum
CREATE TYPE "Accent" AS ENUM ('SKY', 'PINK', 'PURPLE');

-- CreateTable
CREATE TABLE "Therapist" (
    "id" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "roleAr" TEXT NOT NULL,
    "credentialEn" TEXT NOT NULL DEFAULT '',
    "credentialAr" TEXT NOT NULL DEFAULT '',
    "experienceEn" TEXT NOT NULL DEFAULT '',
    "experienceAr" TEXT NOT NULL DEFAULT '',
    "expertiseEn" TEXT[],
    "expertiseAr" TEXT[],
    "bioEn" TEXT NOT NULL,
    "bioAr" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "photoPosition" TEXT,
    "photoZoom" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "profilePhotoPosition" TEXT,
    "character" TEXT,
    "accent" "Accent" NOT NULL DEFAULT 'SKY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Therapist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Therapist_sortOrder_idx" ON "Therapist"("sortOrder");


-- Current team.
INSERT INTO "Therapist" ("id", "sortOrder", "visible", "nameEn", "nameAr", "roleEn", "roleAr", "credentialEn", "credentialAr", "experienceEn", "experienceAr", "expertiseEn", "expertiseAr", "bioEn", "bioAr", "photoUrl", "photoPosition", "photoZoom", "profilePhotoPosition", "character", "accent", "updatedAt") VALUES
  ($$seed-rawan$$, 1, true, $$Rawan Cherry$$, $$روان شرّي$$, $$Founder | Speech-Language Therapist | Feeding Therapist | Family Coach$$, $$المؤسِّسة | معالجة نطق ولغة | معالجة تغذية | مدرّبة أسرية$$, $$Master's in Speech-Language Pathology (SLP), OPT Level 1 Certified$$, $$ماجستير في علاج النطق واللغة (SLP)، حاصلة على شهادة OPT المستوى الأول$$, $$6+ years in speech-language therapy & feeding therapy$$, $$أكثر من 6 سنوات في علاج النطق واللغة وعلاج التغذية$$, ARRAY[$$Communication disorders$$, $$Feeding therapy$$, $$Family coaching$$, $$Pediatric SLP$$]::TEXT[], ARRAY[$$اضطرابات التواصل$$, $$علاج التغذية$$, $$الإرشاد الأسري$$, $$علاج النطق واللغة للأطفال$$]::TEXT[], $$Rawan founded Caresse Clinic with a deep commitment to every child's right to communicate and thrive. With over 6 years of clinical experience and a Master's in Speech-Language Pathology, she specializes in language and communication difficulties, feeding and swallowing challenges, severe ASD, and developmental delays. Certified in OPT Level 1, she integrates a sensory-motor approach and provides individualized, family-centered intervention, guiding parents with practical strategies to support progress beyond the therapy setting.$$, $$أسّست روان عيادة Caresse انطلاقاً من التزام عميق بحقّ كل طفل في التواصل والازدهار. بخبرة سريرية تزيد على 6 سنوات وشهادة ماجستير في علاج النطق واللغة، تتخصّص في صعوبات اللغة والتواصل، وتحدّيات التغذية والبلع، واضطراب طيف التوحّد الشديد، وتأخّر النموّ. وهي حاصلة على شهادة OPT المستوى الأول، وتعتمد مقاربة حسّية حركية، وتقدّم تدخّلاً فردياً يتمحور حول الأسرة، فترشد الأهل باستراتيجيات عملية تدعم التقدّم خارج جلسات العلاج.$$, $$/images/team/rawan-cherry.jpg$$, NULL, 1, NULL, $$/images/illustrations/team-character-rawan-cherry.png$$, 'SKY', CURRENT_TIMESTAMP),
  ($$seed-ali$$, 2, true, $$Ali Atie$$, $$علي عطيّة$$, $$Applied Behavior Analysis Technician (ABAT)$$, $$فنّي تحليل السلوك التطبيقي (ABAT)$$, $$Applied Behavior Analysis Technician (ABAT)$$, $$فنّي تحليل السلوك التطبيقي (ABAT)$$, $$3+ years in behavioral intervention$$, $$أكثر من 3 سنوات في التدخّل السلوكي$$, ARRAY[$$Autism spectrum support$$, $$Behavior modification$$, $$Social skills training$$]::TEXT[], ARRAY[$$دعم اضطراب طيف التوحّد$$, $$تعديل السلوك$$, $$التدريب على المهارات الاجتماعية$$]::TEXT[], $$Ali is dedicated to transforming challenging behaviors into meaningful progress through evidence-based, compassionate intervention. With over 3 years of experience supporting more than 200 individuals with ASD across Lebanon and Kuwait, his individualized behavioral interventions focus on developing functional skills, communication, independence, and adaptive behavior. He works closely with families to ensure consistency of strategies across environments, empowering parents to support their child's progress at home and in daily life.$$, $$يكرّس علي عمله لتحويل السلوكيات الصعبة إلى تقدّم ملموس، من خلال تدخّل مبنيّ على الأدلّة العلمية وقائم على التعاطف. بخبرة تزيد على 3 سنوات دعم خلالها أكثر من 200 شخص من ذوي اضطراب طيف التوحّد في لبنان والكويت، تركّز تدخّلاته السلوكية الفردية على تنمية المهارات الوظيفية والتواصل والاستقلالية والسلوك التكيّفي. ويعمل عن قرب مع العائلات لضمان اتّساق الاستراتيجيات في مختلف البيئات، ممّا يمكّن الأهل من دعم تقدّم طفلهم في المنزل وفي الحياة اليومية.$$, $$/images/team/ali-atie.jpg$$, $$50% 19%$$, 1.15, $$50% 22%$$, $$/images/illustrations/team-character-ali-atie.png$$, 'PINK', CURRENT_TIMESTAMP),
  ($$seed-mariam$$, 3, true, $$Mariam Al-Itawi$$, $$مريم العيتاوي$$, $$Occupational Therapist$$, $$معالجة انشغالية$$, $$Bachelor's in Occupational Therapy, Certified Sensory Integration Specialist$$, $$بكالوريوس في العلاج الانشغالي، أخصائية معتمدة في التكامل الحسّي$$, $$10+ years in pediatric occupational therapy$$, $$أكثر من 10 سنوات في العلاج الانشغالي للأطفال$$, ARRAY[$$Fine & gross motor skills$$, $$Daily living activities$$, $$Sensory integration$$]::TEXT[], ARRAY[$$المهارات الحركية الدقيقة والكبرى$$, $$أنشطة الحياة اليومية$$, $$التكامل الحسّي$$]::TEXT[], $$Mariam brings her occupational therapy expertise to children with ASD, ADHD, learning and developmental difficulties, sensory processing challenges, and delays in sensorimotor, fine, and gross motor skills. Her interventions focus on activities of daily living and independence, developing functional skills and promoting greater confidence and autonomy. She provides individualized, client-centered treatment plans and collaborates closely with parents with practical strategies to support progress within therapy and in daily life.$$, $$توظّف مريم خبرتها في العلاج الانشغالي لمساعدة الأطفال الذين يعانون اضطراب طيف التوحّد، واضطراب فرط الحركة وتشتّت الانتباه، وصعوبات التعلّم والنموّ، وتحدّيات المعالجة الحسّية، وتأخّر المهارات الحسّية الحركية والحركية الدقيقة والكبرى. تركّز تدخّلاتها على أنشطة الحياة اليومية والاستقلالية، فتنمّي المهارات الوظيفية وتعزّز الثقة والاستقلال. وتقدّم خطط علاج فردية تتمحور حول الطفل، وتتعاون عن قرب مع الأهل باستراتيجيات عملية تدعم التقدّم داخل الجلسات وفي الحياة اليومية.$$, $$/images/team/mariam-al-itawi.jpg$$, NULL, 1, NULL, $$/images/illustrations/team-character-mariam-al-itawi.png$$, 'PURPLE', CURRENT_TIMESTAMP);
