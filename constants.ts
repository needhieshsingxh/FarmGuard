import { Report, Alert, FarmStats, Role, BiosecurityReport, BiosecurityChecklistItem, CommunityPost, ProductVerification, FarmCompliance } from './types';

export const DUMMY_FARM_STATS: FarmStats = {
  animalCount: 1250,
  mortalityRate: 2.5,
  feedUsage: 450,
  biosecurityScore: 92,
};

export const DUMMY_REPORTS: Report[] = [
  { id: 'R001', date: '2023-10-29', animalCount: 1245, feedUsage: 455, symptoms: 'Minor coughing observed in 2 pigs.', temperature: 38.5, status: 'Reviewed', submittedBy: 'John Farmer' },
  { id: 'R002', date: '2023-10-28', animalCount: 1250, feedUsage: 450, symptoms: 'No visible symptoms.', temperature: 38.2, status: 'Reviewed', submittedBy: 'John Farmer' },
];

export const DUMMY_ALERTS: Alert[] = [
  { id: 'A001', titleKey: 'alertTitleInactivePoultry', descriptionKey: 'alertDescInactivePoultry', severity: 'High', date: '2023-10-29', typeKey: 'aiCamera' },
  { id: 'A002', titleKey: 'alertTitleIbdHotspot', descriptionKey: 'alertDescIbdHotspot', severity: 'Critical', date: '2023-10-29', typeKey: 'prediction' },
  { id: 'A003', titleKey: 'alertTitleAvianFlu', descriptionKey: 'alertDescAvianFlu', severity: 'Critical', date: '2023-10-28', typeKey: 'outbreak' },
  { id: 'A004', titleKey: 'alertTitleTempSpike', descriptionKey: 'alertDescTempSpike', severity: 'High', date: '2023-10-28', typeKey: 'system' },
  { id: 'A005', titleKey: 'alertTitleProtocolReminder', descriptionKey: 'alertDescProtocolReminder', severity: 'Medium', date: '2023-10-25', typeKey: 'system' },
];

// Remove Vet from selectable roles
export const ROLES = [Role.Farmer, Role.Admin, Role.Consumer];

export const FARM_DATA_TRENDS = [
    { nameKey: 'monthJan', mortality: 4, feed: 400, temp: 38.5 },
    { nameKey: 'monthFeb', mortality: 3, feed: 420, temp: 38.6 },
    { nameKey: 'monthMar', mortality: 5, feed: 410, temp: 38.4 },
    { nameKey: 'monthApr', mortality: 4, feed: 430, temp: 38.7 },
    { nameKey: 'monthMay', mortality: 6, feed: 400, temp: 38.9 },
    { nameKey: 'monthJun', mortality: 5, feed: 440, temp: 38.8 },
];

export const DUMMY_BIOSECURITY_REPORTS: BiosecurityReport[] = [
    { id: 'BSR001', batchId: 'PIG-BATCH-012', date: '2023-10-28', complianceScore: 95, statusKey: 'complete' },
    { id: 'BSR002', batchId: 'POULTRY-BATCH-034', date: '2023-10-21', complianceScore: 88, statusKey: 'complete' },
    { id: 'BSR003', batchId: 'PIG-BATCH-011', date: '2023-10-14', complianceScore: 91, statusKey: 'complete' },
    { id: 'BSR004', batchId: 'POULTRY-BATCH-035', date: '2023-11-01', complianceScore: 0, statusKey: 'inProgress' },
];

export const DUMMY_CHECKLIST_ITEMS: BiosecurityChecklistItem[] = [
    { id: 'C01', categoryKey: 'entryProtocols', taskKey: 'taskFootbaths' },
    { id: 'C02', categoryKey: 'entryProtocols', taskKey: 'taskVisitorLog' },
    { id: 'C03', categoryKey: 'entryProtocols', taskKey: 'taskVehicleDisinfection' },
    { id: 'C04', categoryKey: 'feedAndWater', taskKey: 'taskSecureFeed' },
    { id: 'C05', categoryKey: 'feedAndWater', taskKey: 'taskFlushWater' },
    { id: 'C06', categoryKey: 'pestControl', taskKey: 'taskBaitStations' },
    { id: 'C07', categoryKey: 'pestControl', taskKey: 'taskNoRodentSigns' },
    { id: 'C08', categoryKey: 'cleaning', taskKey: 'taskPensCleaned' },
];

const AVATAR_ANIL = 'https://ui-avatars.com/api/?name=Anil+Kumar&background=8b5cf6&color=fff';
const AVATAR_PRIYA = 'https://ui-avatars.com/api/?name=Dr+Priya&background=ec4899&color=fff';
const AVATAR_RAJESH = 'https://ui-avatars.com/api/?name=Rajesh+Patel&background=22c55e&color=fff';
const AVATAR_SUNITA = 'https://ui-avatars.com/api/?name=Sunita+Sharma&background=f59e0b&color=fff';
const AVATAR_VIKRAM = 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10b981&color=fff';

const USER_ID_RAJESH = 'user-rajesh-patel';
const USER_ID_ANIL = 'user-anil-kumar';
const USER_ID_PRIYA = 'user-dr-priya';
const USER_ID_SUNITA = 'user-sunita-sharma';
const USER_ID_VIKRAM = 'user-vikram-singh';

export const DUMMY_COMMUNITY_POSTS: CommunityPost[] = [
    { 
        id: 'P01', 
        authorId: USER_ID_ANIL,
        author: 'Anil Kumar', 
        avatar: AVATAR_ANIL, 
        date: '2 days ago', 
        title: 'Best practices for managing IBD during monsoon?', 
        content: 'With the rainy season approaching, I am worried about IBD. What extra precautions are you all taking? Last year was tough.', 
        views: 156,
        likes: 22,
        dislikes: 1,
        userVote: null,
        comments: [
            { id: 'C01-1', authorId: USER_ID_PRIYA, author: 'Dr. Priya', avatar: AVATAR_PRIYA, content: 'Good question, Anil. Ensure water sources are clean and not contaminated by runoff. Also, consider adding electrolytes to their water to reduce stress.', likes: 10, dislikes: 0, userVote: null },
            { id: 'C01-2', authorId: USER_ID_RAJESH, author: 'Rajesh Patel', avatar: AVATAR_RAJESH, content: 'I double my usual amount of disinfectant in footbaths during monsoon. It seems to help.', likes: 5, dislikes: 0, userVote: null },
        ]
    },
    { 
        id: 'P02', 
        authorId: USER_ID_SUNITA,
        author: 'Sunita Sharma', 
        avatar: AVATAR_SUNITA, 
        date: '5 days ago', 
        title: 'Has anyone tried the new organic feed from AgroFeeds?', 
        content: 'I saw an ad for a new organic poultry feed that claims to boost immunity. Has anyone used it and seen results? Wondering if it is worth the extra cost.', 
        views: 98,
        likes: 15,
        dislikes: 3,
        userVote: null,
        comments: [
            { id: 'C02-1', authorId: USER_ID_VIKRAM, author: 'Vikram Singh', avatar: AVATAR_VIKRAM, content: 'I have been using it for a month. Mortality rate seems slightly lower, but it is too early to say for sure. The feed cost is about 15% higher.', likes: 7, dislikes: 1, userVote: null },
        ]
    },
    { 
        id: 'P03', 
        authorId: USER_ID_RAJESH,
        author: 'Rajesh Patel', 
        avatar: AVATAR_RAJESH, 
        date: '1 week ago', 
        title: 'Dealing with sudden drop in egg production.', 
        content: 'My flock\'s egg production suddenly dropped by 15% this week. No other visible symptoms. Any ideas what could be the cause before I call the vet?', 
        views: 234,
        likes: 31,
        dislikes: 0,
        userVote: null,
        comments: [
             { id: 'C03-1', authorId: USER_ID_SUNITA, author: 'Sunita Sharma', avatar: AVATAR_SUNITA, content: 'Check for mites. Sometimes they are hard to spot and can cause stress, leading to a drop in production.', likes: 12, dislikes: 0, userVote: null },
             { id: 'C03-2', authorId: USER_ID_ANIL, author: 'Anil Kumar', avatar: AVATAR_ANIL, content: 'Could be a lighting issue as well. Are they getting enough light consistently?', likes: 4, dislikes: 0, userVote: null },
        ]
    },
];

export const DUMMY_PRODUCTS: ProductVerification[] = [
    { id: 'PROD12345', farmId: 'FARM001', productName: 'Organic Chicken Breast', batchDate: '2023-10-25', status: 'safe' },
    { id: 'PROD67890', farmId: 'FARM003', productName: 'Free-Range Eggs', batchDate: '2023-10-22', status: 'warning' },
    { id: 'PROD11223', farmId: 'FARM002', productName: 'Pork Sausages', batchDate: '2023-10-28', status: 'safe' },
];

export const DUMMY_FARMS_COMPLIANCE: FarmCompliance[] = [
    { id: 'FARM001', name: 'Green Valley Farms', region: 'Punjab', complianceScore: 95, lastInspection: '2023-10-15' },
    { id: 'FARM002', name: 'Sunrise Poultry', region: 'Haryana', complianceScore: 88, lastInspection: '2023-10-12' },
    { id: 'FARM003', name: 'Happy Pigs Co.', region: 'Rajasthan', complianceScore: 72, lastInspection: '2023-09-28' },
    { id: 'FARM004', name: 'Organic Feathers', region: 'Punjab', complianceScore: 98, lastInspection: '2023-10-20' },
    { id: 'FARM005', name: 'Deccan Agri', region: 'Telangana', complianceScore: 85, lastInspection: '2023-10-18' },
    { id: 'FARM006', name: 'Bengal Livestock', region: 'West Bengal', complianceScore: 79, lastInspection: '2023-10-05' },
    { id: 'FARM007', name: 'Godavari Farms', region: 'Telangana', complianceScore: 91, lastInspection: '2023-10-22' },
    { id: 'FARM008', name: 'Mahi Farms', region: 'Rajasthan', complianceScore: 82, lastInspection: '2023-10-11' },
];