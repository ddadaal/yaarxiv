export interface Profile {
  /** Honor. 头衔 */
  honor: string;
  /** is honor visible to other users? */
  honorPublic: boolean;

  /** Job Title. 职称*/
  jobTitle: string;
  /** is job title visible to other users? */
  jobTitlePublic: boolean;

  /** Institution */
  institution: string;
  /** is institution visible to other users */
  institutionPublic: boolean;

  /** Academic keywords. 学术关键词 */
  academicKeywords: string[];

  /** Research Labels. 研究标签 */
  researchLabels: string[];
}
