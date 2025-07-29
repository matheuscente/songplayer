import albumService from "./album.service.factory";
import artistService from "./artist.service.factory";
import albumWithRelationshipService from "./albumWithRelationship.factory";
import songWithRelationshipService from "./songWithRelationship.factory";
import artistWithRelationshipService from "./artistWithRelationship.factory";
import composerWithRelationshipService from "./composerWithRelationship.factory";
import songAlbumService from "./songAlbum.service.factory";
import songService from "./song.service.factory";
import songComposerService from "./songComposer.service.factory";
import composerService from "./composer.service.factory";


const setupDependencies = () => {
  albumService.setDependencies( artistService);

  artistService.setDependencies(albumService);

  albumWithRelationshipService.setDependencies(artistWithRelationshipService, albumService, songAlbumService, songService)

  songWithRelationshipService.setDependencies(songService, songAlbumService, songComposerService)

  artistWithRelationshipService.setDependencies(artistService, albumService)

  composerWithRelationshipService.setDependencies(composerService, songComposerService)

  songAlbumService.setDependencies(songService, albumService)

  songComposerService.setDependencies(songService, composerService)

  
};

export default setupDependencies
