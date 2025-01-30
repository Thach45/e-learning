enum EUserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED',
}

enum EUserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    EXPERT = "EXPERT",
}
enum ECourseStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    
}
enum ECourseLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}
enum ELessonType {
    VIDEO = 'VIDEO',
    TEXT = 'TEXT'
   
}
enum EVideoType {
    DRIVE = 'DRIVE',
    YOUTUBE = 'YOUTUBE',

}
export { EUserStatus, EUserRole, ECourseStatus, ECourseLevel, ELessonType , EVideoType};