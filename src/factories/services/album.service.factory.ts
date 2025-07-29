import albumRepository from "../repositories/album.repository.factory";

import AlbumService from "../../services/album.service";

const albumService = new AlbumService(albumRepository);

export default albumService;
